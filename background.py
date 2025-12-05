import requests
import pdfplumber
from datetime import date, datetime
import warnings
from requests.exceptions import SSLError, RequestException
import urllib3
import re
import os

# --- 1. Проверка дня недели ---
# Monday=0 ... Sunday=6
weekday = datetime.today().weekday()
if weekday >= 5:  # 5=Saturday, 6=Sunday
    print("Сегодня выходной — скрипт не работает.")
    exit()

# Формируем URL файла PDF с сегодняшней датой в имени
today_str = date.today().strftime("%d.%m.%Y")
PDF_URL = f"https://sh1-petropavlovskkamchatskij-r30.gosweb.gosuslugi.ru/netcat_files/50/2957/Menyu_na_{today_str}g..pdf"
OUTPUT_FILE = "Schoolnew/foodmenu.txt"

print(f"Using PDF URL: {PDF_URL}")
print("Downloading PDF...")

pdf_bytes = None

# --- 2. Попытка загрузки PDF с нормальной верификацией ---
try:
    resp = requests.get(PDF_URL, timeout=20)
    # Если страницы нет (404)
    if resp.status_code == 404:
        print("Файл PDF не найден на сервере. Возможно, меню ещё не выложили.")
        exit()
    resp.raise_for_status()
    pdf_bytes = resp.content

except SSLError:
    print("SSL certificate verification failed.")
    try:
        import certifi
        print("Retrying using certifi CA bundle...")
        resp = requests.get(PDF_URL, verify=certifi.where(), timeout=20)

        if resp.status_code == 404:
            print("Файл PDF не найден на сервере.")
            exit()

        resp.raise_for_status()
        pdf_bytes = resp.content

    except Exception:
        print("Retry with certifi failed. Falling back to insecure request (verify=False).")
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        resp = requests.get(PDF_URL, verify=False, timeout=20)

        if resp.status_code == 404:
            print("Файл PDF не найден на сервере.")
            exit()

        resp.raise_for_status()
        pdf_bytes = resp.content

except RequestException as e:
    print(f"Не удалось скачать PDF: {e}")
    exit()

# Если вдруг pdf_bytes пустой
if not pdf_bytes:
    print("Ошибка: PDF не был загружен.")
    exit()

# Сохраняем временный PDF
with open("temp.pdf", "wb") as f:
    f.write(pdf_bytes)

print("Reading PDF...")
text_output = ""

# --- 3. Парсинг PDF ---
with pdfplumber.open("temp.pdf") as pdf:
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            text_output += page_text + "\n\n"

# --- Функции обработки текста ---
def get_section(text, start_pattern, end_patterns):
    m = re.search(start_pattern, text, flags=re.I)
    if not m:
        return ""
    start = m.end()
    end = len(text)
    for pat in end_patterns:
        m2 = re.search(pat, text[start:], flags=re.I)
        if m2:
            candidate = start + m2.start()
            if candidate < end:
                end = candidate
    return text[start:end]

def extract_dish_names(section_text):
    names = []
    for line in section_text.splitlines():
        line = line.strip()
        if not line:
            continue
        if re.match(r'^\d', line):
            continue
        if re.search(r"\b\d+\s*[-–—]\s*\d+\s*лет\b", line):
            continue
        if re.search(r'Наименование|ИТОГО|Калькулятор', line, flags=re.I):
            continue
        m = re.match(r'^([^\d].*?)\s+\d', line)
        if m:
            name = m.group(1).strip()
        else:
            if re.fullmatch(r'[\W\d_]+', line):
                continue
            if line.upper() == line and len(line) < 40:
                continue
            name = line
        name = name.rstrip('.,;:')
        if name:
            names.append(name)
    seen = set()
    out = []
    for n in names:
        key = n.lower()
        if key not in seen:
            seen.add(key)
            out.append(n)
    return out

# --- Извлечение секций ---
breakfast_text = get_section(text_output, r'ЗАВТРАК', [r'ОБЕД', r'ПОЛДНИК', r'ИТОГО'])
lunch_text     = get_section(text_output, r'ОБЕД', [r'ПОЛДНИК', r'ИТОГО'])
snack_text     = get_section(text_output, r'ПОЛДНИК', [r'ИТОГО', r'ВСЕГО'])

breakfast_names = extract_dish_names(breakfast_text)
lunch_names     = extract_dish_names(lunch_text)
snack_names     = extract_dish_names(snack_text)

# --- 4. Запись результата ---
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("Завтрак: " + ", ".join(breakfast_names) + "\n")
    f.write("Обед: " + ", ".join(lunch_names) + "\n")
    f.write("Полдник: " + ", ".join(snack_names) + "\n")
    f.write(f"Дата меню: {today_str}\n")

print("PDF parsed and result saved.")