from __future__ import annotations

import json
import math
import os
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

DAY_NAMES = {
    0: "Понедельник",
    1: "Вторник",
    2: "Среда",
    3: "Четверг",
    4: "Пятница",
    5: "Суббота",
    6: "Воскресенье",
}

# Расписание синхронизировано с Schoolnew/index.html (блок const schedule)
SCHEDULE: dict[int, dict[str, list[dict[str, str]]]] = {
    0: {
        "shift1": [
            {"lesson": "Классный час", "start": "08:15", "end": "08:45"},
            {"lesson": "1-й урок", "start": "08:55", "end": "09:35"},
            {"lesson": "2-й урок", "start": "09:50", "end": "10:30"},
            {"lesson": "3-й урок", "start": "10:45", "end": "11:25"},
            {"lesson": "4-й урок", "start": "11:30", "end": "12:10"},
            {"lesson": "5-й урок", "start": "12:20", "end": "13:00"},
            {"lesson": "6-й урок", "start": "13:20", "end": "14:00"},
            {"lesson": "7-й урок", "start": "14:15", "end": "14:55"},
        ],
        "shift2": [
            {"lesson": "0-й урок", "start": "12:20", "end": "13:00"},
            {"lesson": "1-й урок", "start": "13:20", "end": "14:00"},
            {"lesson": "2-й урок", "start": "14:15", "end": "14:55"},
            {"lesson": "3-й урок", "start": "15:10", "end": "15:50"},
            {"lesson": "Классный час", "start": "16:05", "end": "16:35"},
            {"lesson": "4-й урок", "start": "16:40", "end": "17:20"},
            {"lesson": "5-й урок", "start": "17:30", "end": "18:10"},
            {"lesson": "6-й урок", "start": "18:20", "end": "19:00"},
        ],
    },
    1: {
        "shift1": [
            {"lesson": "1-й урок", "start": "08:15", "end": "08:55"},
            {"lesson": "2-й урок", "start": "09:05", "end": "09:45"},
            {"lesson": "3-й урок", "start": "10:00", "end": "10:40"},
            {"lesson": "4-й урок", "start": "11:00", "end": "11:40"},
            {"lesson": "5-й урок", "start": "11:50", "end": "12:30"},
            {"lesson": "6-й урок", "start": "12:50", "end": "13:30"},
            {"lesson": "7-й урок", "start": "13:50", "end": "14:30"},
        ],
        "shift2": [
            {"lesson": "0-й урок", "start": "11:50", "end": "12:30"},
            {"lesson": "1-й урок", "start": "12:50", "end": "13:30"},
            {"lesson": "2-й урок", "start": "13:50", "end": "14:30"},
            {"lesson": "3-й урок", "start": "14:45", "end": "15:25"},
            {"lesson": "4-й урок", "start": "15:40", "end": "16:20"},
            {"lesson": "5-й урок", "start": "16:30", "end": "17:10"},
            {"lesson": "6-й урок", "start": "17:20", "end": "18:00"},
        ],
    },
    2: {
        "shift1": [
            {"lesson": "1-й урок", "start": "08:15", "end": "08:55"},
            {"lesson": "2-й урок", "start": "09:05", "end": "09:45"},
            {"lesson": "3-й урок", "start": "10:00", "end": "10:40"},
            {"lesson": "Классный час", "start": "10:55", "end": "11:25"},
            {"lesson": "4-й урок", "start": "11:30", "end": "12:10"},
            {"lesson": "5-й урок", "start": "12:20", "end": "13:00"},
            {"lesson": "6-й урок", "start": "13:20", "end": "14:00"},
            {"lesson": "7-й урок", "start": "14:15", "end": "14:55"},
        ],
        "shift2": [
            {"lesson": "0-й урок", "start": "12:20", "end": "13:00"},
            {"lesson": "1-й урок", "start": "13:20", "end": "14:00"},
            {"lesson": "2-й урок", "start": "14:15", "end": "14:55"},
            {"lesson": "3-й урок", "start": "15:10", "end": "15:50"},
            {"lesson": "Классный час", "start": "16:05", "end": "16:35"},
            {"lesson": "4-й урок", "start": "16:40", "end": "17:20"},
            {"lesson": "5-й урок", "start": "17:30", "end": "18:10"},
            {"lesson": "6-й урок", "start": "18:20", "end": "19:00"},
        ],
    },
    3: {
        "shift1": [
            {"lesson": "1-й урок", "start": "08:15", "end": "08:55"},
            {"lesson": "2-й урок", "start": "09:05", "end": "09:45"},
            {"lesson": "3-й урок", "start": "10:00", "end": "10:40"},
            {"lesson": "Классный час", "start": "10:55", "end": "11:25"},
            {"lesson": "4-й урок", "start": "11:30", "end": "12:10"},
            {"lesson": "5-й урок", "start": "12:20", "end": "13:00"},
            {"lesson": "6-й урок", "start": "13:20", "end": "14:00"},
            {"lesson": "7-й урок", "start": "14:15", "end": "14:55"},
        ],
        "shift2": [
            {"lesson": "0-й урок", "start": "12:20", "end": "13:00"},
            {"lesson": "1-й урок", "start": "13:20", "end": "14:00"},
            {"lesson": "2-й урок", "start": "14:15", "end": "14:55"},
            {"lesson": "3-й урок", "start": "15:10", "end": "15:50"},
            {"lesson": "Классный час", "start": "16:05", "end": "16:35"},
            {"lesson": "4-й урок", "start": "16:40", "end": "17:20"},
            {"lesson": "5-й урок", "start": "17:30", "end": "18:10"},
            {"lesson": "6-й урок", "start": "18:20", "end": "19:00"},
        ],
    },
    4: {
        "shift1": [
            {"lesson": "1-й урок", "start": "08:15", "end": "08:55"},
            {"lesson": "2-й урок", "start": "09:05", "end": "09:45"},
            {"lesson": "3-й урок", "start": "10:00", "end": "10:40"},
            {"lesson": "4-й урок", "start": "11:00", "end": "11:40"},
            {"lesson": "5-й урок", "start": "11:50", "end": "12:30"},
            {"lesson": "6-й урок", "start": "12:50", "end": "13:30"},
            {"lesson": "7-й урок", "start": "13:50", "end": "14:30"},
        ],
        "shift2": [
            {"lesson": "0-й урок", "start": "11:50", "end": "12:30"},
            {"lesson": "1-й урок", "start": "12:50", "end": "13:30"},
            {"lesson": "2-й урок", "start": "13:50", "end": "14:30"},
            {"lesson": "3-й урок", "start": "14:45", "end": "15:25"},
            {"lesson": "4-й урок", "start": "15:40", "end": "16:20"},
            {"lesson": "5-й урок", "start": "16:30", "end": "17:10"},
            {"lesson": "6-й урок", "start": "17:20", "end": "18:00"},
        ],
    },
    5: {"shift1": [], "shift2": []},
    6: {"shift1": [], "shift2": []},
}


@dataclass
class Segment:
    title: str
    start: datetime
    end: datetime
    kind: str


def require_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Environment variable {name} is required")
    return value


def parse_menu(menu_path: Path) -> tuple[dict[str, str], str | None]:
    if not menu_path.exists():
        return {}, None

    menu: dict[str, str] = {}
    menu_date: str | None = None

    for raw_line in menu_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw_line.strip()
        if not line or ":" not in line:
            continue

        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if not key:
            continue

        if key.lower() == "дата меню":
            menu_date = value
        else:
            menu[key] = value

    return menu, menu_date


def parse_time(now: datetime, hhmm: str) -> datetime:
    hh, mm = hhmm.split(":", 1)
    return now.replace(hour=int(hh), minute=int(mm), second=0, microsecond=0)


def to_segments(now: datetime, lessons: list[dict[str, str]]) -> list[Segment]:
    lesson_segments = [
        Segment(
            title=lesson["lesson"],
            start=parse_time(now, lesson["start"]),
            end=parse_time(now, lesson["end"]),
            kind="lesson",
        )
        for lesson in lessons
    ]

    segments: list[Segment] = []
    for idx, lesson in enumerate(lesson_segments):
        segments.append(lesson)
        if idx + 1 >= len(lesson_segments):
            continue

        next_lesson = lesson_segments[idx + 1]
        if lesson.end < next_lesson.start:
            segments.append(
                Segment(
                    title=f"Перемена между {lesson.title} и {next_lesson.title}",
                    start=lesson.end,
                    end=next_lesson.start,
                    kind="break",
                )
            )

    return segments


def format_duration(total_seconds: float) -> str:
    minutes = max(0, math.ceil(total_seconds / 60))
    hours, mins = divmod(minutes, 60)
    if hours and mins:
        return f"{hours} ч {mins} мин"
    if hours:
        return f"{hours} ч"
    return f"{mins} мин"


def progress_bar(ratio: float, width: int = 20) -> str:
    safe_ratio = min(max(ratio, 0.0), 1.0)
    filled = int(round(safe_ratio * width))
    return f"[{'#' * filled}{'-' * (width - filled)}] {int(round(safe_ratio * 100))}%"


def format_shift_state(shift_label: str, now: datetime, lessons: list[dict[str, str]]) -> str:
    if not lessons:
        return "\n".join(
            [
                f"{shift_label}",
                "Что сейчас: уроков нет",
                "Промежуток: --",
                "Сколько осталось: 0 мин",
                f"Ползунок: {progress_bar(0.0)}",
            ]
        )

    segments = to_segments(now, lessons)
    first_lesson = segments[0]
    last_lesson = segments[-1]

    if now < first_lesson.start:
        return "\n".join(
            [
                f"{shift_label}",
                f"Что сейчас: до начала ({first_lesson.title})",
                f"Промежуток: {first_lesson.start:%H:%M}-{first_lesson.end:%H:%M}",
                f"Сколько осталось: {format_duration((first_lesson.start - now).total_seconds())}",
                f"Ползунок: {progress_bar(0.0)}",
            ]
        )

    if now >= last_lesson.end:
        return "\n".join(
            [
                f"{shift_label}",
                "Что сейчас: уроки закончились",
                f"Промежуток: {last_lesson.start:%H:%M}-{last_lesson.end:%H:%M}",
                "Сколько осталось: 0 мин",
                f"Ползунок: {progress_bar(1.0)}",
            ]
        )

    for segment in segments:
        if segment.start <= now < segment.end:
            total = (segment.end - segment.start).total_seconds()
            elapsed = (now - segment.start).total_seconds()
            remaining = (segment.end - now).total_seconds()
            return "\n".join(
                [
                    f"{shift_label}",
                    f"Что сейчас: {segment.title}",
                    f"Промежуток: {segment.start:%H:%M}-{segment.end:%H:%M}",
                    f"Сколько осталось: {format_duration(remaining)}",
                    f"Ползунок: {progress_bar(elapsed / total if total else 0.0)}",
                ]
            )

    return "\n".join(
        [
            f"{shift_label}",
            "Что сейчас: неизвестно",
            "Промежуток: --",
            "Сколько осталось: --",
            f"Ползунок: {progress_bar(0.0)}",
        ]
    )


def format_schedule(shift_label: str, lessons: list[dict[str, str]]) -> str:
    lines = [shift_label]
    if not lessons:
        lines.append("- Уроков нет")
    else:
        lines.extend(f"- {lesson['start']}-{lesson['end']} {lesson['lesson']}" for lesson in lessons)
    return "\n".join(lines)


def build_message(now: datetime, menu_path: Path) -> str:
    day_index = now.weekday()
    day_title = DAY_NAMES[day_index]
    today_schedule = SCHEDULE[day_index]

    menu, menu_date = parse_menu(menu_path)
    today_text = now.strftime("%d.%m.%Y")

    menu_lines: list[str] = []
    ordered_meals = ["Завтрак", "Обед", "Полдник"]

    for meal in ordered_meals:
        if meal in menu:
            menu_lines.append(f"- {meal}: {menu[meal]}")

    extra_items = [key for key in menu.keys() if key not in ordered_meals]
    for key in extra_items:
        menu_lines.append(f"- {key}: {menu[key]}")

    if not menu_lines:
        menu_lines.append("- Меню пока не найдено")

    if menu_date and menu_date != today_text:
        menu_lines.append(f"- Внимание: в файле меню дата {menu_date}, а сегодня {today_text}")
    elif menu_date:
        menu_lines.append(f"- Дата меню: {menu_date}")

    state_shift_1 = format_shift_state("1 смена", now, today_schedule["shift1"])
    state_shift_2 = format_shift_state("2 смена", now, today_schedule["shift2"])

    message = "\n".join(
        [
            f"Обновлено: {now:%d.%m.%Y %H:%M} ({day_title}, Камчатка)",
            "",
            "Расписание уроков на сегодня",
            format_schedule("1 смена", today_schedule["shift1"]),
            format_schedule("2 смена", today_schedule["shift2"]),
            "",
            "Меню еды на сегодня",
            *menu_lines,
            "",
            "Состояние двух смен",
            state_shift_1,
            "",
            state_shift_2,
        ]
    )

    if len(message) > 4096:
        raise RuntimeError("Telegram message is too long (>4096 characters). Shorten menu content.")

    return message


def telegram_request(token: str, method: str, payload: dict[str, Any]) -> dict[str, Any]:
    url = f"https://api.telegram.org/bot{token}/{method}"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            body = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        try:
            data = json.loads(body)
        except json.JSONDecodeError as json_error:
            raise RuntimeError(f"Telegram API HTTP {exc.code}: {body}") from json_error

        description = data.get("description", "")
        if method == "editMessageText" and "message is not modified" in description.lower():
            return {"ok": True, "result": "not_modified"}

        raise RuntimeError(f"Telegram API error: {description}")

    data = json.loads(body)
    if not data.get("ok"):
        raise RuntimeError(f"Telegram API returned not ok: {data}")

    return data


def resolve_message_id(token: str, channel_id: str, text: str) -> tuple[int, bool]:
    explicit_message_id = os.getenv("TELEGRAM_MESSAGE_ID", "").strip()
    if explicit_message_id:
        return int(explicit_message_id), False

    try:
        chat_data = telegram_request(token, "getChat", {"chat_id": channel_id})
        pinned = chat_data.get("result", {}).get("pinned_message", {})
        pinned_id = pinned.get("message_id")
        if pinned_id:
            return int(pinned_id), False
    except Exception as exc:
        print(f"Could not read pinned message, will send a new one: {exc}")

    sent = telegram_request(
        token,
        "sendMessage",
        {
            "chat_id": channel_id,
            "text": text,
            "disable_web_page_preview": True,
        },
    )
    new_message_id = int(sent["result"]["message_id"])

    if os.getenv("AUTO_PIN_SENT_MESSAGE", "1") == "1":
        try:
            telegram_request(
                token,
                "pinChatMessage",
                {
                    "chat_id": channel_id,
                    "message_id": new_message_id,
                    "disable_notification": True,
                },
            )
        except Exception as exc:
            print(f"Could not pin message automatically: {exc}")

    return new_message_id, True


def main() -> None:
    dry_run = os.getenv("DRY_RUN", "0") == "1"
    tz_name = os.getenv("BOT_TIMEZONE", "Asia/Kamchatka")
    menu_path = Path(os.getenv("MENU_FILE_PATH", "Schoolnew/foodmenu.txt"))
    now = datetime.now(ZoneInfo(tz_name))
    text = build_message(now, menu_path)

    if dry_run:
        print(text)
        return

    token = require_env("TELEGRAM_BOT_TOKEN")
    channel_id = require_env("TELEGRAM_CHANNEL_ID")
    message_id, was_created = resolve_message_id(token, channel_id, text)
    if was_created:
        print(f"Created message {message_id}. Next runs will edit pinned message automatically.")
        return

    telegram_request(
        token,
        "editMessageText",
        {
            "chat_id": channel_id,
            "message_id": message_id,
            "text": text,
            "disable_web_page_preview": True,
        },
    )

    print("Telegram message updated")


if __name__ == "__main__":
    main()
