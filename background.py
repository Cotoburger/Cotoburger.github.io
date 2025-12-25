import requests
import pdfplumber
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import warnings
from requests.exceptions import SSLError, RequestException
import urllib3
import re
import os

import pytesseract
import cv2
import numpy as np
from pdf2image import convert_from_path
from PIL import Image

OUTPUT_FILE = "Schoolnew/foodmenu.txt"
KAMCHATKA_TZ = ZoneInfo("Asia/Kamchatka")
now_kamchatka = datetime.now(KAMCHATKA_TZ)

adjusted_time = now_kamchatka + timedelta(hours=5)
today_str = adjusted_time.strftime("%d.%m.%Y")
weekday_num = adjusted_time.weekday()

print(f"Камчатское время: {now_kamchatka}")
print(f"Скорректированное время: {adjusted_time}")
print(f"Дата меню: {today_str}")

if weekday_num >= 5:
    print("Сегодня выходной по камчатскому времени. Меню не загружается.")
    exit()

PDF_URL = f"https://sh1-petropavlovskkamchatskij-r30.gosweb.gosuslugi.ru/netcat_files/50/2957/Menyu_na_{today_str}g..pdf"

print(f"Using PDF URL: {PDF_URL}")

try:
    resp = requests.get(PDF_URL, timeout=20)
    if resp.status_code == 404:
        print("Файл PDF не найден.")
        exit()
    resp.raise_for_status()
    pdf_bytes = resp.content
except SSLError:
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    resp = requests.get(PDF_URL, verify=False, timeout=20)
    if resp.status_code == 404:
        exit()
    pdf_bytes = resp.content
except RequestException as e:
    print(f"Ошибка: {e}")
    exit()

with open("temp.pdf", "wb") as f:
    f.write(pdf_bytes)

text_output = ""
with pdfplumber.open("temp.pdf") as pdf:
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text and len(page_text.strip()) > 20:
            text_output += page_text + "\n"

if len(text_output.strip()) < 50:
    images = convert_from_path("temp.pdf", dpi=300)
    for img in images:
        img_np = np.array(img)
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        gray = cv2.medianBlur(gray, 3)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        page_text = pytesseract.image_to_string(thresh, config=r'--oem 3 --psm 6 -l rus')
        text_output += page_text + "\n"

def get_section(text, start_pattern, end_patterns):
    # \b гарантирует, что "Обед" не совпадет с "Обедняя"
    # re.M позволяет ^ искать в начале каждой строки
    regex_start = rf'^\s*{start_pattern}\b'
    m = re.search(regex_start, text, flags=re.I | re.M)
    if not m:
        return ""
    start = m.end()
    end = len(text)
    for pat in end_patterns:
        regex_end = rf'^\s*{pat}\b'
        m2 = re.search(regex_end, text[start:], flags=re.I | re.M)
        if m2:
            candidate = start + m2.start()
            if candidate < end:
                end = candidate
    return text[start:end]

def extract_dish_names(section_text):
    names = []
    stop_words = {'наименование', 'итого', 'калькулятор', 'цена', 'ккал', 'сунг', 'выход', 'всего', 'утверждаю', 'директор'}
    
    for line in section_text.splitlines():
        line = line.strip()
        if not line or len(line) < 3:
            continue
        if any(word in line.lower() for word in stop_words):
            continue
        if re.search(r'\d-\d', line): # убираем "7-11 лет"
            continue

        # Отсекаем цифры (вес, цена) после названия
        parts = re.split(r'\s+\d', line)
        name = parts[0].strip('.,;:- ')
        
        # Проверка, что в названии есть буквы, а не только мусор
        if name and re.search(r'[а-яА-Я]', name):
            names.append(name)

    seen = set()
    return [n for n in names if not (n.lower() in seen or seen.add(n.lower()))]

breakfast_text = get_section(text_output, 'ЗАВТРАК', ['ОБЕД', 'ПОЛДНИК', 'ИТОГО'])
lunch_text     = get_section(text_output, 'ОБЕД', ['ПОЛДНИК', 'ИТОГО'])
snack_text     = get_section(text_output, 'ПОЛДНИК', ['ИТОГО', 'ВСЕГО'])

res = {
    "Завтрак": extract_dish_names(breakfast_text) or ["Документ неправильно отсканирован"],
    "Обед": extract_dish_names(lunch_text) or ["Документ неправильно отсканирован"],
    "Полдник": extract_dish_names(snack_text) or ["Документ неправильно отсканирован"]
}

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    for key, val in res.items():
        f.write(f"{key}: {', '.join(val)}\n")
    f.write(f"Дата меню: {today_str}\n")

print("✅ Готово.")