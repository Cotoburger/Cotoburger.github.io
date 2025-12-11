import requests
import pdfplumber
from datetime import datetime
from zoneinfo import ZoneInfo
import warnings
from requests.exceptions import SSLError, RequestException
import urllib3
import re
import os

# OCR
import pytesseract
import cv2
import numpy as np
from pdf2image import convert_from_path
from PIL import Image

# ========= НАСТРОЙКИ =========
OUTPUT_FILE = "Schoolnew/foodmenu.txt"

# ========= ЧАСОВОЙ ПОЯС КАМЧАТКИ =========
KAMCHATKA_TZ = ZoneInfo("Asia/Kamchatka")
now_kamchatka = datetime.now(KAMCHATKA_TZ)
today_str = now_kamchatka.strftime("%d.%m.%Y")
weekday_num = now_kamchatka.weekday()

print(f"Камчатское время: {now_kamchatka}")
print(f"Дата (Камчатка): {today_str}")

# не запускаем в выходные
if weekday_num >= 5:
    print("Сегодня выходной по камчатскому времени. Меню не загружается.")
    exit()

# ========= URL =========
PDF_URL = f"https://sh1-petropavlovskkamchatskij-r30.gosweb.gosuslugi.ru/netcat_files/50/2957/Menyu_na_{today_str}g..pdf"

print(f"Using PDF URL: {PDF_URL}")
print("Downloading PDF...")

pdf_bytes = None

# ========= СКАЧИВАНИЕ PDF =========
try:
    resp = requests.get(PDF_URL, timeout=20)

    if resp.status_code == 404:
        print("Файл PDF не найден.")
        exit()

    resp.raise_for_status()
    pdf_bytes = resp.content

except SSLError:
    print("SSL error, retrying without verify...")
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    resp = requests.get(PDF_URL, verify=False, timeout=20)

    if resp.status_code == 404:
        print("Файл PDF не найден.")
        exit()

    resp.raise_for_status()
    pdf_bytes = resp.content

except RequestException as e:
    print(f"Не удалось скачать PDF: {e}")
    exit()

if not pdf_bytes:
    print("PDF не загружен.")
    exit()

# ========= СОХРАНЕНИЕ =========
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

with open("temp.pdf", "wb") as f:
    f.write(pdf_bytes)

# ========= СНАЧАЛА ПРОБУЕМ ОБЫЧНЫЙ ТЕКСТ =========
print("Trying normal text extraction...")

text_output = ""

with pdfplumber.open("temp.pdf") as pdf:
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text and len(page_text.strip()) > 20:
            text_output += page_text + "\n\n"

# ========= ЕСЛИ ТЕКСТА НЕТ — ВКЛЮЧАЕМ OCR =========
if len(text_output.strip()) < 50:
    print("No readable text, using OCR...")

    images = convert_from_path("temp.pdf", dpi=300)

    for img in images:
        img_np = np.array(img)

        # серый
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)

        # лёгкая чистка
        gray = cv2.medianBlur(gray, 3)

        # бинаризация
        _, thresh = cv2.threshold(
            gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )

        # OCR
        custom_config = r'--oem 3 --psm 6 -l rus'
        page_text = pytesseract.image_to_string(thresh, config=custom_config)

        if page_text:
            text_output += page_text + "\n\n"

# ========= ФУНКЦИИ РАЗБОРА =========
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

    # удаление дублей
    seen = set()
    out = []
    for n in names:
        key = n.lower()
        if key not in seen:
            seen.add(key)
            out.append(n)

    return out

# ========= ИЗВЛЕЧЕНИЕ =========
breakfast_text = get_section(text_output, r'ЗАВТРАК', [r'ОБЕД', r'ПОЛДНИК', r'ИТОГО'])
lunch_text     = get_section(text_output, r'ОБЕД', [r'ПОЛДНИК', r'ИТОГО'])
snack_text     = get_section(text_output, r'ПОЛДНИК', [r'ИТОГО', r'ВСЕГО'])

breakfast_names = extract_dish_names(breakfast_text)
lunch_names     = extract_dish_names(lunch_text)
snack_names     = extract_dish_names(snack_text)

# ========= ПРОВЕРКА НА ПУСТЫЕ ПОЛЯ =========
if not breakfast_names:
    breakfast_names = ["Ошибка: Не удалось извлечь завтрак"]

if not lunch_names:
    lunch_names = ["Ошибка: Не удалось извлечь обед"]

if not snack_names:
    snack_names = ["Ошибка: Не удалось извлечь полдник"]

# ========= СОХРАНЕНИЕ =========
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("Завтрак: " + ", ".join(breakfast_names) + "\n")
    f.write("Обед: " + ", ".join(lunch_names) + "\n")
    f.write("Полдник: " + ", ".join(snack_names) + "\n")
    f.write(f"Дата меню: {today_str}\n")

print("✅ Меню успешно извлечено.")