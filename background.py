import os
import re
import time
import requests
from google import genai
from google.genai import types
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import urllib3
import pathlib

DEV = 0
OUTPUT_FILE = "Schoolnew/foodmenu.txt"
MAX_RETRIES = 5
RETRY_DELAY = 3

# Текущее семейство: gemini-3-flash. Берём такую же или новее.
BASE_VERSION = (3, 0)
FALLBACK_MODEL = "gemini-3.6-flash"      # если список моделей получить не удалось
MODEL_OVERRIDE = os.environ.get("GEMINI_MODEL")  # можно задать вручную

# То, что не является обычной flash-моделью
BAD_WORDS = ("image", "tts", "live", "embedding", "robotics", "audio",
             "native", "computer-use", "pro", "imagen", "veo", "lyria", "lite")

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

PDF_URLS = [
    f"https://sh1-petropavlovskkamchatskij-r30.gosweb.gosuslugi.ru/netcat_files/50/2957/Menyu_na_{today_str}g..pdf",
    f"https://sh1-petropavlovskkamchatskij-r30.gosweb.gosuslugi.ru/netcat_files/50/2957/Menyu_na_{today_str}..pdf"
]

api_key = os.environ.get("GOOGLE_API_KEY")

if not api_key:
    print("API ключ не найден.")
    exit()

client = genai.Client(api_key=api_key)


def pick_model():
    """Самая новая модель семейства gemini-N-flash, не старше BASE_VERSION."""
    if MODEL_OVERRIDE:
        print(f"Модель задана вручную: {MODEL_OVERRIDE}")
        return MODEL_OVERRIDE

    best = None  # (ключ сортировки, имя)
    try:
        for m in client.models.list():
            name = m.name.replace("models/", "")
            actions = getattr(m, "supported_actions", None)
            if actions is not None and "generateContent" not in actions:
                continue

            match = re.fullmatch(r"gemini-(\d+)(?:\.(\d+))?-flash(?:-.+)?", name)
            if not match or any(w in name for w in BAD_WORDS):
                continue

            version = (int(match.group(1)), int(match.group(2) or 0))
            if version < BASE_VERSION:
                continue

            is_stable = not ("preview" in name or "exp" in name)
            key = (version, is_stable)  # новее версия лучше, при равенстве стабильная лучше
            if best is None or key > best[0]:
                best = (key, name)
    except Exception as e:
        print(f"Не удалось получить список моделей: {e}")

    if best:
        print(f"Выбрана модель: {best[1]}")
        return best[1]

    print(f"Подходящая модель не найдена, использую {FALLBACK_MODEL}")
    return FALLBACK_MODEL


def get_menu():
    try:
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

        pdf_data = None

        for url in PDF_URLS:
            try:
                print(f"Пробую скачать: {url}")
                resp = requests.get(url, verify=False, timeout=30)

                if resp.status_code == 200:
                    pdf_data = resp.content
                    with open("temp.pdf", "wb") as f:
                        f.write(pdf_data)
                    print("PDF найден.")
                    break
                else:
                    print(f"Не найдено (status {resp.status_code})")

            except Exception as e:
                print(f"Ошибка загрузки: {e}")

        if not pdf_data and DEV == 1 and os.path.exists("temp.pdf"):
            print("DEV: Использую локальный temp.pdf")
            with open("temp.pdf", "rb") as f:
                pdf_data = f.read()

        if not pdf_data:
            print("Файл меню не найден ни по одной ссылке.")
            return

        print("Отправка PDF в Gemini API...")

        prompt = """Извлеки названия блюд. Формат:
Завтрак: Блюдо1, Блюдо2, Блюдо3, Блюдо4, Блюдо5
Обед: Блюдо1, Блюдо2, Блюдо3
Полдник: Блюдо1, Блюдо2, Блюдо3, Блюдо4
(это лишь пример. тебе нужно подставить наименования из файла. не используй форматирование и четко соответствуй формату)"""

        model = pick_model()

        def call_api_with_retry():
            for attempt in range(MAX_RETRIES):
                try:
                    return client.models.generate_content(
                        model=model,
                        contents=[
                            types.Part.from_bytes(data=pdf_data, mime_type='application/pdf'),
                            prompt
                        ]
                    )
                except Exception as e:
                    print(f"Попытка {attempt + 1}/{MAX_RETRIES} не удалась: {e}")

                    # 404 и 400 повторять бессмысленно
                    if "404" in str(e) or "400" in str(e):
                        raise
                    if attempt < MAX_RETRIES - 1:
                        print(f"Повторная попытка через {RETRY_DELAY} секунд...")
                        time.sleep(RETRY_DELAY)
                    else:
                        raise

        response = call_api_with_retry()
        menu_text = response.text.strip()

        if menu_text:
            path = pathlib.Path(OUTPUT_FILE)
            path.parent.mkdir(parents=True, exist_ok=True)

            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                f.write(menu_text + "\n")
                f.write(f"Дата меню: {today_str}\n")

            print("✅ Меню успешно сохранено.")

    except Exception as e:
        print(f"Ошибка: {e}")


get_menu()