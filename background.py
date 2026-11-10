import os
import re
import time
import requests
from google import genai
from google.genai import types, errors
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import urllib3
import pathlib

DEV = 0
OUTPUT_FILE = "Schoolnew/foodmenu.txt"
MAX_RETRIES = 3          # повторы при временных ошибках (500/503)
RETRY_DELAY = 3
MAX_MODELS_TO_TRY = 4    # сколько моделей максимум пробовать

# Можно жёстко задать модель через переменную окружения GEMINI_MODEL,
# иначе выбирается автоматически
MODEL_OVERRIDE = os.environ.get("GEMINI_MODEL")

# Эти модели не нужны (картинки, звук, эмбеддинги и т.д.).
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


def pick_models():
    """Возвращает список подходящих flash-моделей: новые и стабильные первыми."""
    if MODEL_OVERRIDE:
        print(f"Модель задана вручную: {MODEL_OVERRIDE}")
        return [MODEL_OVERRIDE]

    found = []
    try:
        for m in client.models.list():
            name = m.name.replace("models/", "")
            actions = getattr(m, "supported_actions", None)
            if actions is not None and "generateContent" not in actions:
                continue
            if not re.match(r"gemini-.*flash", name):
                continue
            if any(w in name for w in BAD_WORDS):
                continue
            found.append(name)
    except Exception as e:
        print(f"Не удалось получить список моделей: {e}")

    def sort_key(name):
        m = re.match(r"gemini-(\d+)(?:\.(\d+))?-flash", name)
        ver = (int(m.group(1)), int(m.group(2) or 0)) if m else (0, 0)
        # новее версия -> выше; стабильная раньше preview
        return (-ver[0], -ver[1], "preview" in name or "exp" in name, name)

    models = sorted(set(found), key=sort_key)

    if not models:
        print("Список пуст, использую запасные имена.")
        models = ["gemini-flash-latest", "gemini-3.6-flash"]

    models = models[:MAX_MODELS_TO_TRY]
    print(f"Кандидаты: {', '.join(models)}")
    return models


def generate_with_fallback(pdf_data, prompt):
    """Пробует модели по очереди. 400/404/429 -> следующая модель, 5xx -> повтор."""
    last_error = None

    for model in pick_models():
        print(f"Пробую модель: {model}")
        for attempt in range(MAX_RETRIES):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=[
                        types.Part.from_bytes(data=pdf_data, mime_type="application/pdf"),
                        prompt,
                    ],
                )
                if not (response.text or "").strip():
                    print(f"[{model}] пустой ответ, пробую следующую")
                    last_error = "пустой ответ"
                    break
                print(f"Успех: {model}")
                return response

            except errors.APIError as e:
                last_error = e
                code = getattr(e, "code", None)
                print(f"[{model}] попытка {attempt + 1}/{MAX_RETRIES}: {code} {e}")

                if code in (400, 404, 429):
                    # нет модели / не принимает такой вход / кончился лимит
                    break
                if code in (500, 503, 504) and attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_DELAY)
                    continue
                if code in (500, 503, 504):
                    break
                raise

    raise RuntimeError(f"Ни одна модель не сработала. Последняя ошибка: {last_error}")


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

        response = generate_with_fallback(pdf_data, prompt)
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