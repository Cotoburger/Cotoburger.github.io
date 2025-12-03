import requests
import pdfplumber
from datetime import date
import warnings
from requests.exceptions import SSLError, RequestException
import urllib3

# Формируем URL файла PDF с сегодняшней датой в имени
today_str = date.today().strftime("%d.%m.%Y")
PDF_URL = f"https://sh1-petropavlovskkamchatskij-r30.gosweb.gosuslugi.ru/netcat_files/50/2957/Menyu_na_{today_str}g..pdf"
OUTPUT_FILE = "result.txt"

print(f"Using PDF URL: {PDF_URL}")
print("Downloading PDF...")

# Попытка загрузить файл с нормальной верификацией, с обработкой ошибок сертификата.
try:
    resp = requests.get(PDF_URL, timeout=20)
    resp.raise_for_status()
    pdf_bytes = resp.content
except SSLError:
    print("SSL certificate verification failed.")
    try:
        import certifi
        print("Retrying using certifi CA bundle...")
        resp = requests.get(PDF_URL, verify=certifi.where(), timeout=20)
        resp.raise_for_status()
        pdf_bytes = resp.content
    except ImportError:
        print("`certifi` not installed — cannot use CA bundle. You can install it with: pip install certifi")
        print("Falling back to an insecure request (verify=False). This is not recommended.")
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        resp = requests.get(PDF_URL, verify=False, timeout=20)
        resp.raise_for_status()
        pdf_bytes = resp.content
    except SSLError:
        print("Retry with certifi failed. Falling back to insecure request (verify=False).")
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        resp = requests.get(PDF_URL, verify=False, timeout=20)
        resp.raise_for_status()
        pdf_bytes = resp.content
except RequestException as e:
    print(f"Failed to download PDF: {e}")
    raise

with open("temp.pdf", "wb") as f:
    f.write(pdf_bytes)

print("Reading PDF...")
text_output = ""

with pdfplumber.open("temp.pdf") as pdf:
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            text_output += page_text + "\n\n"
# --- извлекаем только названия блюд из разделов Завтрак/Обед/Полдник ---
import re

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
        # Пропускаем строки, начинающиеся с цифр (выход, вес и т.п.)
        if re.match(r'^\d', line):
            continue
        # Пропускаем возрастные диапазоны вида "7-11 лет", "12–18 лет" и т.п.
        if re.search(r"\b\d+\s*[-–—]\s*\d+\s*лет\b", line):
            continue
        # Пропускаем служебные строки
        if re.search(r'Наименование|НАИМЕНОВАНИЕ|ИТОГО|Калькулятор|Зав\.|ИТОГО', line, flags=re.I):
            continue
        # Если строка начинается с буквы и далее идут числа - берем часть до первого числа
        m = re.match(r'^([^\d].*?)\s+\d', line)
        if m:
            name = m.group(1).strip()
        else:
            # Если нет чисел — возможно это всё-таки название
            # Отбрасываем заголовки в верхнем регистре
            if re.fullmatch(r'[\W\d_]+', line):
                continue
            if line.upper() == line and len(line) < 40:
                # вероятный заголовок типа "ЗАВТРАК" или "ОБЕД"
                continue
            name = line
        # Убираем лишние символы в конце
        name = name.rstrip('.,;:')
        if name:
            names.append(name)
    # Удаляем дубликаты, сохраняя порядок
    seen = set()
    out = []
    for n in names:
        key = n.lower()
        if key not in seen:
            seen.add(key)
            out.append(n)
    return out

breakfast_text = get_section(text_output, r'ЗАВТРАК', [r'ОБЕД', r'ПОЛДНИК', r'ИТОГО'])
lunch_text = get_section(text_output, r'ОБЕД', [r'ПОЛДНИК', r'ИТОГО', r'ПОЛДНИК'])
snack_text = get_section(text_output, r'ПОЛДНИК', [r'ИТОГО', r'ВСЕГО ЗА ДЕНЬ', r'ВСЕГО'])

breakfast_names = extract_dish_names(breakfast_text)
lunch_names = extract_dish_names(lunch_text)
snack_names = extract_dish_names(snack_text)

# Формируем итоговый файл в требуемом формате
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("Завтрак: ")
    f.write(', '.join(breakfast_names))
    f.write("\n")
    f.write("Обед: ")
    f.write(', '.join(lunch_names))
    f.write("\n")
    f.write("Полдник: ")
    f.write(', '.join(snack_names))
    f.write("\n")

print("PDF parsed and result saved.")