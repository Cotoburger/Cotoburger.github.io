import os
import requests
from google import genai
from google.genai import types
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import urllib3
import pathlib

DEV = 0
OUTPUT_FILE = "Schoolnew/foodmenu.txt"

KAMCHATKA_TZ = ZoneInfo("Asia/Kamchatka")
now_kamchatka = datetime.now(KAMCHATKA_TZ)
days_to_subtract = 1 if DEV == 1 else 0

adjusted_time = now_kamchatka + timedelta(hours=5) - timedelta(days=days_to_subtract)
today_str = adjusted_time.strftime("%d.%m.%Y")
weekday_num = adjusted_time.weekday()

print(f"--- ЗАПУСК (DEV={DEV}) ---")
print(f"Дата: {today_str}")

if DEV == 0 and weekday_num >= 5:
    print(f"Выходной: {today_str}. Пропускаем.")
    exit()

PDF_URL = f"https://sh1-petropavlovskkamchatskij-r30.gosweb.gosuslugi.ru/netcat_files/50/2957/Menyu_na_{today_str}g..pdf"
api_key = os.environ.get("GOOGLE_API_KEY")

if not api_key:
    exit()

client = genai.Client(api_key=api_key)

def get_menu():
    try:
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        resp = requests.get(PDF_URL, verify=False, timeout=30)
        
        pdf_data = None
        if resp.status_code == 200:
            pdf_data = resp.content
            with open("temp.pdf", "wb") as f:
                f.write(pdf_data)
        elif DEV == 1 and os.path.exists("temp.pdf"):
            print("DEV: Использую локальный temp.pdf")
            with open("temp.pdf", "rb") as f:
                pdf_data = f.read()
        
        if not pdf_data:
            print("Файл не найден.")
            return

        print("Анализ...")
        prompt = """Извлеки названия блюд. Формат:
                Завтрак: Соус болоньезе, Макароны отварные, Какао на молоке, Хлеб пшеничный, Яблоко
                Обед: Салат из свежих помидоров и огурцов, Суп картофельный с макаронами с говядиной, Пельмени рыбные с маслом, Компот из черной смородины, Хлеб пшеничный, Хлеб ржано-пшеничный, Мандарин
                Полдник: Кекс творожный, Йогурт питьевой, Яблоко
                     (это лишь пример. тебе нужно подставить наименования из файла. не используй форматирование и четко соответствуй формату)"""
        
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=[
                types.Part.from_bytes(data=pdf_data, mime_type='application/pdf'),
                prompt
            ]
        )
        
        menu_text = response.text.strip()
        
        if menu_text:
            path = pathlib.Path(OUTPUT_FILE)
            path.parent.mkdir(parents=True, exist_ok=True)
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                f.write(menu_text + "\n")
                f.write(f"Дата меню: {today_str}\n")
            print("✅ Готово!")

    except Exception as e:
        print(f"Ошибка: {e}")

get_menu()