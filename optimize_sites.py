#!/usr/bin/env python3
"""Оптимизация анимаций и перерисовки для Schoolnew и Tech.

Запуск из корня репозитория:   python3 optimize_sites.py
Или с путём:                   python3 optimize_sites.py /путь/к/репозиторию

Меняет четыре файла на месте: {Schoolnew,Tech}/{styles.css,index.html}.
Внешний вид не меняется. Скрипт идемпотентен: повторный запуск ничего не сломает,
просто напишет, что правки уже применены (или не найдены).
Откатить можно через git.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(".")
SITES = ["Schoolnew", "Tech"]


def load(path):
    raw = path.read_bytes().decode("utf-8")
    crlf = "\r\n" in raw
    return raw.replace("\r\n", "\n"), crlf


def save(path, text, crlf):
    if crlf:
        text = text.replace("\n", "\r\n")
    path.write_bytes(text.encode("utf-8"))


def lit(text, label, old, new, expect=1):
    n = text.count(old)
    if n != expect:
        print(f"   [--] {label}: найдено {n}, ожидалось {expect} (пропущено)")
        return text
    print(f"   [ok] {label}")
    return text.replace(old, new)


def rx(text, label, pattern, repl, flags=0, expect=1):
    new, n = re.subn(pattern, repl if callable(repl) else (lambda m: repl), text, flags=flags)
    if n != expect:
        print(f"   [--] {label}: найдено {n}, ожидалось {expect} (пропущено)")
        return text
    print(f"   [ok] {label}")
    return new


# ───────────────────────────── CSS ─────────────────────────────
def patch_css(text):
    # 1. класс .scrolling и его невалидный backdrop-filter: 0.1rem
    text = rx(
        text,
        "убрано переключение .scrolling",
        r"/\* Отключаем дорогие эффекты при прокрутке \*/\s*"
        r"body\.scrolling \.lesson-card,\s*body\.scrolling \.lesson-card-full \{[^}]*\}\s*"
        r"body:not\(\.scrolling\) \.lesson-card,\s*body:not\(\.scrolling\) \.lesson-card-full \{[^}]*\}\s*",
        "",
    )

    # 2. will-change: contents — несуществующее для практических целей значение
    text = rx(text, "убран will-change: contents", r"[ \t]*will-change: contents;\n", "", expect=3)

    # 3. снежинки: слой на GPU + translate3d
    if "animation: fall linear infinite;\n    will-change" not in text:
        text = lit(text, ".snowflake: will-change", "animation: fall linear infinite;",
                   "animation: fall linear infinite;\n    will-change: transform, opacity;")
    text = lit(text, "fall: translate3d (0%)", "0% { transform: translateY(0); opacity: 0; }",
               "0% { transform: translate3d(0, 0, 0); opacity: 0; }")
    text = lit(text, "fall: translate3d (100%)", "100% { transform: translateY(110vh); opacity: 0.4; }",
               "100% { transform: translate3d(0, 110vh, 0); opacity: 0.4; }")

    # 4. облака: то же самое
    if "animation: drift linear infinite;\n     will-change" not in text:
        text = lit(text, ".cloud: will-change", "animation: drift linear infinite;",
                   "animation: drift linear infinite;\n     will-change: transform, opacity;")
    text = lit(text, "drift: translate3d (0%)", "transform: translateX(-100vw);",
               "transform: translate3d(-100vw, 0, 0);")
    text = lit(text, "drift: translate3d (100%)", "transform: translateX(150vw);",
               "transform: translate3d(150vw, 0, 0);")

    # 5. ночью карточки почти непрозрачны (alpha 0.922), а мерцающие звёзды под ними
    #    заставляют Safari пересчитывать blur каждый кадр. Размытие там не видно.
    if "night-mode .lesson-card-full {\n  -webkit-backdrop-filter: none;" not in text:
        text = text.rstrip("\n") + """

/* Ночью карточки почти непрозрачны, blur под ними не виден, но дорого стоит
   (звёзды мерцают постоянно, и Safari пересчитывает backdrop каждый кадр) */
body.night-mode .lesson-card,
body.night-mode .lesson-card-full {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}
"""
        print("   [ok] ночью backdrop-filter отключён")
    return text


# ───────────────────────────── JS / HTML ─────────────────────────────
RENDER_FULL_SCHEDULE = r"""function renderFullSchedule() {
        const currentTime = getCurrentTimeInKamchatkaContext();
        const scheduleData = getTodayScheduleData();

        [["shift1", "shift1-full"], ["shift2", "shift2-full"]].forEach(([shiftKey, containerId]) => {
          const container = document.getElementById(containerId);
          if (!container) return;
          const lessons = scheduleData && scheduleData[shiftKey] ? scheduleData[shiftKey] : [];
          const html = lessons.map((lesson) => {
            const isClassHour = /классн|кл\.\s*час/i.test(lesson.lesson);
            const numMatch = lesson.lesson.match(/^(\d+)[\s-]*(?:й урок|я пара)/i);
            const lessonNumber = isClassHour ? "КЛ" : (numMatch ? numMatch[1] : "★");
            const isCurrent = isTimeBetween(currentTime, lesson.start, lesson.end);
            const isPast = currentTime > lesson.end;
            return `<div class="lesson-item ${isCurrent ? "current" : ""} ${isPast ? "past" : ""}"><div class="lesson-number">${lessonNumber}</div><div class="lesson-time">${lesson.start} - ${lesson.end}</div></div>`;
          }).join("");
          // DOM трогаем только если что-то реально изменилось (раньше пересобирался каждую секунду)
          if (container._renderedHtml === html) return;
          container._renderedHtml = html;
          container.innerHTML = html;
        });
      }"""

RESIZE_GUARD = """let _lastViewportWidth = window.innerWidth;
      window.addEventListener("resize", () => {
        // На iOS resize срабатывает при сворачивании панели Safari во время прокрутки.
        // Облака пересчитываем только при реальном изменении ширины.
        if (window.innerWidth === _lastViewportWidth) return;
        _lastViewportWidth = window.innerWidth;
        updateClouds();
      }, { passive: true });"""

NOLESSONS_GUARD = """const currentLessons2 = currentNoLessons.lessons2;
        // Перестраиваем карточки только когда состояние реально изменилось (раньше — каждую секунду)
        const _nlKey = currentLessons1 + "|" + currentLessons2;
        if (applyNoLessonsReasonToShifts._key === _nlKey) return;
        applyNoLessonsReasonToShifts._key = _nlKey;"""

BG_TRANSITION_OLD = 'setTimeout(() => { document.documentElement.style.transition = "background-color 0.5s ease"; }, 50);'
BG_TRANSITION_NEW = ('if (!document.documentElement.style.transition) '
                     'setTimeout(() => { document.documentElement.style.transition = "background-color 0.5s ease"; }, 50);')


def patch_html(text):
    if "function setText(el, v)" in text:
        print("   [--] правки уже применены, пропускаю")
        return text
    # 1. переключение класса .scrolling на каждый скролл
    text = rx(
        text,
        "убран обработчик scroll с классом .scrolling",
        r"let scrollTimeout = null;\s*let isScrolling = false;\s*"
        r"document\.addEventListener\('scroll', \(\) => \{.*?\}, \{ passive: true \}\);[ \t]*\n?",
        "",
        flags=re.S,
    )

    # 2. --vh нигде не используется, а его запись на <html> инвалидирует стили всего документа
    text = lit(text, "убрана запись --vh на <html>",
               'document.documentElement.style.setProperty("--vh", vh + "px");',
               "// --vh нигде не используется; запись на <html> заставляла пересчитывать стили всей страницы")

    # 3. resize → updateClouds только при смене ширины
    text = lit(text, "resize: облака только при смене ширины",
               'window.addEventListener("resize", updateClouds);', RESIZE_GUARD)

    # 4. setText: не трогаем DOM, если текст не поменялся
    text = lit(text, "добавлен setText", "function updateShiftDisplay(",
               'function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }\n\n'
               "      function updateShiftDisplay(")
    start = text.find("function updateShiftDisplay(")
    end = text.find("function getLocalTimes(")
    if start != -1 and end > start:
        body = text[start:end]
        body, n = re.subn(
            r'^([ \t]*)(nameEl|startEl|endEl|remEl\.querySelector\("\.remaining-text"\))\.textContent = (.+);[ \t]*$',
            r"\1setText(\2, \3);",
            body,
            flags=re.M,
        )
        print(f"   [ok] updateShiftDisplay: {n} присваиваний textContent -> setText" if n else
              "   [--] updateShiftDisplay: присваивания не найдены")
        text = text[:start] + body + text[end:]

    # 5. шапка: день недели, плашка, transition фона
    text = lit(text, "день недели через setText",
               'document.getElementById("dayOfWeek").textContent = names[getCurrentDayOfWeek()];',
               'setText(document.getElementById("dayOfWeek"), names[getCurrentDayOfWeek()]);')
    text = lit(text, "плашка через setText",
               "specialBadge.textContent = getSpecialBadgeText(specialEntry);",
               "setText(specialBadge, getSpecialBadgeText(specialEntry));")
    text = lit(text, "transition фона ставится один раз", BG_TRANSITION_OLD, BG_TRANSITION_NEW)

    # 6. полное расписание: не пересобирать DOM каждую секунду
    text = rx(text, "renderFullSchedule переписана",
              r"function renderFullSchedule\(\) \{.*?(?=\n\s*function calculateRemainingTime)",
              RENDER_FULL_SCHEDULE, flags=re.S)

    # 7. карточки «нет уроков»: только при смене состояния
    text = lit(text, "applyNoLessonsReasonToShifts: защита от повторов",
               "const currentLessons2 = currentNoLessons.lessons2;", NOLESSONS_GUARD)

    # 8. GitHub API без токена даёт 60 запросов/час, а мы делали ~80
    text = lit(text, "запрос деплоя раз в 10 минут",
               "setInterval(updateDeployment, 90000)", "setInterval(updateDeployment, 600000)")
    return text


def main():
    for site in SITES:
        for name, fn in (("styles.css", patch_css), ("index.html", patch_html)):
            path = ROOT / site / name
            print(f"\n== {path}")
            if not path.exists():
                print("   файл не найден")
                continue
            text, crlf = load(path)
            save(path, fn(text), crlf)


if __name__ == "__main__":
    main()
