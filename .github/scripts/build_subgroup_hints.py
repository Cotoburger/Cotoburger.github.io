#!/usr/bin/env python3
"""
Строит Tech/subgroup-hints.json — список пар, которые есть ТОЛЬКО у 1-й подгруппы.

Зачем: из Google-таблицы через gviz сайт получает только значения, а информацию об
объединённых ячейках теряет. Пара всей группы — это ячейка, объединённая на оба столбца
подгрупп; пара только 1-й подгруппы — обычная ячейка, а столбец 2-й подгруппы пуст.
По значениям их не отличить, поэтому здесь читаем настоящий файл и смотрим на объединения.

Ключ записи: "ДД.ММ.ГГГГ|ЧЧ:ММ|Название группы"  (так же его собирает сайт).

Переменные окружения (все необязательные):
  SHEET_ID_PATH  откуда взять ID таблицы   (по умолчанию Tech/sheet-id.json)
  OUT_PATH       куда писать результат      (по умолчанию Tech/subgroup-hints.json)
  SHEET_FILE     локальный .xls/.xlsx для проверки без скачивания
"""
import io
import json
import os
import re
import sys
import urllib.request
from datetime import date, datetime, timezone

SHEET_ID_PATH = os.environ.get("SHEET_ID_PATH", "Tech/sheet-id.json")
OUT_PATH = os.environ.get("OUT_PATH", "Tech/subgroup-hints.json")
SHEET_FILE = os.environ.get("SHEET_FILE")

TIME_RE = re.compile(r"(\d{1,2})[.:](\d{2})\s*-\s*(\d{1,2})[.:](\d{2})")
DATE_RE = re.compile(r"(\d{2}\.\d{2}\.\d{4})")


def norm(v):
    return re.sub(r"\s+", " ", str(v if v is not None else "")).strip()


def cell_to_str(v):
    if v is None:
        return ""
    if isinstance(v, (datetime, date)):
        return v.strftime("%d.%m.%Y")
    if isinstance(v, float) and v.is_integer():
        return str(int(v))
    return str(v)


def is_xlsx(data):
    return data[:2] == b"PK"


def is_xls(data):
    return data[:4] == b"\xd0\xcf\x11\xe0"


def download(sheet_id):
    urls = [
        # обычная Google-таблица
        f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=xlsx",
        # загруженный в Drive файл .xls/.xlsx
        f"https://drive.google.com/uc?export=download&id={sheet_id}",
    ]
    last = None
    for url in urls:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (schedule-sync)"})
            data = urllib.request.urlopen(req, timeout=60).read()
            if is_xlsx(data) or is_xls(data):
                return data
            last = f"{url}: ответ не похож на таблицу"
        except Exception as e:  # noqa: BLE001
            last = f"{url}: {e}"
    raise RuntimeError(f"Не удалось скачать таблицу ({last})")


def load_grid(data):
    """Возвращает (rows, merges). merges: (row_from, row_to, col_from, col_to), to — не включая, с нуля."""
    if is_xlsx(data):
        from openpyxl import load_workbook

        wb = load_workbook(io.BytesIO(data), data_only=True)
        ws = wb.worksheets[0]  # сайт читает первый лист (gid=0)
        rows = [[cell_to_str(v) for v in row] for row in ws.iter_rows(values_only=True)]
        merges = [(r.min_row - 1, r.max_row, r.min_col - 1, r.max_col) for r in ws.merged_cells.ranges]
        return rows, merges

    import xlrd

    wb = xlrd.open_workbook(file_contents=data, formatting_info=True)
    s = wb.sheet_by_index(0)
    rows = [[cell_to_str(s.cell_value(r, c)) for c in range(s.ncols)] for r in range(s.nrows)]
    return rows, list(s.merged_cells)


def build_hints(rows, merges):
    # --- шапка ---
    header_idx = None
    for r in range(min(len(rows), 30)):
        if any(re.search(r"день\s+недели", norm(v), re.I) for v in rows[r]):
            header_idx = r
            break
    if header_idx is None:
        raise RuntimeError("Не нашёл строку «День недели» — изменилась структура таблицы")

    header = rows[header_idx]
    day_col, number_col, time_col = 0, 1, 2
    for c, v in enumerate(header):
        t = norm(v)
        if re.search(r"день\s+недели", t, re.I):
            day_col = c
        elif re.search(r"номер\s+пары", t, re.I):
            number_col = c
        elif re.search(r"время\s+пары", t, re.I):
            time_col = c
    start_col = max(day_col, number_col, time_col) + 1

    next_row = rows[header_idx + 1] if header_idx + 1 < len(rows) else []
    has_sub_row = any(re.search(r"подгруппа", norm(v), re.I) for v in next_row)
    data_start = header_idx + (2 if has_sub_row else 1)

    # --- группы и их столбцы подгрупп (та же логика, что на сайте) ---
    groups = {}  # имя -> {номер подгруппы: столбец}
    order = {}   # имя -> сколько столбцов уже видели
    current = ""
    for c in range(start_col, len(header)):
        v = norm(header[c])
        if v:
            current = v
        if not current:
            continue
        order[current] = order.get(current, 0) + 1
        sub_num = 0
        if has_sub_row and c < len(next_row):
            m = re.search(r"(\d+)", norm(next_row[c]))
            if m:
                sub_num = int(m.group(1))
        if not sub_num:
            sub_num = order[current]
        groups.setdefault(current, {})[sub_num] = c
    if not groups:
        raise RuntimeError("Не нашёл группы в шапке таблицы")

    def merged_over(r, c1, c2):
        """Есть ли объединение, которое накрывает и столбец 1-й, и столбец 2-й подгруппы в строке r."""
        for r0, r1, k0, k1 in merges:
            if r0 <= r < r1 and k0 <= c1 < k1 and k0 <= c2 < k1:
                return True
        return False

    # --- данные ---
    hints = set()
    date_key = None
    for r in range(data_start, len(rows)):
        row = rows[r]

        def cell(c):
            return norm(row[c]) if c < len(row) else ""

        a_cell = cell(day_col)
        if a_cell:
            m = DATE_RE.search(a_cell)
            date_key = m.group(1) if m else a_cell
        if not date_key:
            continue
        tm = TIME_RE.search(cell(time_col))
        if not tm:
            continue
        start = f"{tm.group(1).zfill(2)}:{tm.group(2)}"

        for name, subs in groups.items():
            c1, c2 = subs.get(1), subs.get(2)
            if c1 is None or c2 is None:
                continue
            a, b = cell(c1), cell(c2)
            if a and not b and not merged_over(r, c1, c2):
                hints.add(f"{date_key}|{start}|{name}")
    return sorted(hints)


def main():
    if SHEET_FILE:
        data = open(SHEET_FILE, "rb").read()
        source = os.path.basename(SHEET_FILE)
    else:
        sheet_id = json.load(open(SHEET_ID_PATH, encoding="utf-8"))["id"]
        data = download(sheet_id)
        source = sheet_id

    rows, merges = load_grid(data)
    hints = build_hints(rows, merges)
    print(f"Пар только для 1-й подгруппы: {len(hints)}")

    old = None
    if os.path.exists(OUT_PATH):
        try:
            old = json.load(open(OUT_PATH, encoding="utf-8")).get("sub1Only")
        except Exception:  # noqa: BLE001
            pass
    if old == hints:
        print("Без изменений")
        return

    os.makedirs(os.path.dirname(OUT_PATH) or ".", exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(
            {
                "source": source,
                "updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "sub1Only": hints,
            },
            f,
            ensure_ascii=False,
            indent=2,
        )
        f.write("\n")
    print("Записал", OUT_PATH)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # noqa: BLE001
        sys.exit(f"Ошибка: {e}")
