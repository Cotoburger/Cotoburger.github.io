const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');
const socialIcons = document.querySelectorAll('.social-icon');

function pxToRem(px) {
    return px / 16 + 'rem';
}



const schedule1 = {
    1: {
        shift1: [
            {lesson: "BIOL 0002 Botany (S112)", start: "08:00", end: "10:35"},
            {lesson: "BIOL 0002 Botany (S112)", start: "11:00", end: "13:25"},
            {lesson: "CHEM 0001A General Chemistry (lab) (ST-1 001)", start: "14:00", end: "23:35"},
        ],

    },
    2: {
        shift1: [
            {lesson: "MATH 0027 Trigonometry (V301)", start: "10:15", end: "12:20"},
            {lesson: "CHEM 0001A General Chemistry (lect) (S 101)", start: "12:30", end: "13:50"},
            {lesson: "CHEM 0001A General Chemistry (lab) (ST-1 001)", start: "14:00", end: "17:05"},
        ],

    },
    3: {
        shift1: [
            {lesson: "BIOL 0002 Botany (S112)", start: "08:00", end: "10:35"},
            {lesson: "BIOL 0002 Botany (S112)", start: "11:00", end: "13:25"},
            {lesson: "CHEM 0001X Problem Solving for Chem 1A (AT-2 002)", start: "14:00", end: "15:05"},
        ],

    },
    4: {
        shift1: [
            {lesson: "MATH 0027 Trigonometry (V301)", start: "10:15", end: "12:20"},
            {lesson: "CHEM 0001A General Chemistry (lect) (S 101)", start: "12:30", end: "13:50"},
            {lesson: "CHEM 0001A General Chemistry (lab) (ST-1 001)", start: "14:00", end: "17:05"},
        ],

    },
    5: {
        shift1: [
            {lesson: "HED 0001 Standard First Aid/CPR (G 126)", start: "09:00", end: "10:50"},
        ],

    }
};

const schedule2 = {
    1: {
        shift1: [
            {lesson: "Period 1", start: "08:30", end: "10:00"},
            {lesson: "Period 2", start: "10:06", end: "11:36"},
            {lesson: "Period 3", start: "11:42", end: "13:13"},
            {lesson: "Lunch", start: "13:13", end: "13:43"},
            {lesson: "Period 4", start: "13:49", end: "15:20"},
        ],

    },
    2: {
        shift1: [
            {lesson: "Period 1", start: "08:30", end: "10:00"},
            {lesson: "Period 2", start: "10:06", end: "11:36"},
            {lesson: "Period 3", start: "11:42", end: "13:13"},
            {lesson: "Lunch", start: "13:13", end: "13:43"},
            {lesson: "Period 4", start: "13:49", end: "15:20"},
        ],

    },
    3: {
        shift1: [
            {lesson: "BIOL 0002 Botany (S112)", start: "08:00", end: "10:35"},
            {lesson: "BIOL 0002 Botany (S112)", start: "11:00", end: "13:25"},
            {lesson: "CHEM 0001X Problem Solving for Chem 1A (AT-2 002)", start: "14:00", end: "15:05"},
        ],

    },
    4: {
        shift1: [
            {lesson: "Period 1", start: "08:30", end: "10:00"},
            {lesson: "Period 2", start: "10:06", end: "11:36"},
            {lesson: "Period 3", start: "11:42", end: "13:13"},
            {lesson: "Lunch", start: "13:13", end: "13:43"},
            {lesson: "Period 4", start: "13:49", end: "15:20"},
        ],

    },
    5: {
        shift1: [
            {lesson: "Period 1", start: "08:30", end: "10:00"},
            {lesson: "Period 2", start: "10:06", end: "11:36"},
            {lesson: "Period 3", start: "11:42", end: "13:13"},
            {lesson: "Lunch", start: "13:13", end: "13:43"},
            {lesson: "Period 4", start: "13:49", end: "15:20"},
        ],

    }
};

let currentSchedule = schedule1;

const getSacramentoTime = () => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
};

const timeToSeconds = (time) => {
    if (typeof time === "number") {
        // Если это уже число (секунды), возвращаем как есть
        return time;
    }

    if (typeof time === "string") {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60;
    }

    console.error("timeToSeconds: Некорректный формат времени:", time);
    return 0; // Значение по умолчанию при ошибке
};
const convertScheduleToSeconds = (schedule) => {
    if (typeof schedule !== "object" || schedule === null) {
        console.error("convertScheduleToSeconds: Ожидается объект расписания, но получено:", schedule);
        return;
    }

    // Перебираем дни недели в расписании
    Object.entries(schedule).forEach(([day, shifts]) => {
        Object.keys(shifts).forEach((shift) => {
            shifts[shift].forEach((lesson, lessonIndex) => {
                lesson.start = timeToSeconds(lesson.start);
                lesson.end = timeToSeconds(lesson.end);
            });
        });
    });
};

convertScheduleToSeconds(currentSchedule);

let simulatedTime = null;

const simulateTime = (day, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    simulatedTime = getSacramentoTime();
    simulatedTime.setHours(hours, minutes, 0, 0);
    simulatedTime.setDate(simulatedTime.getDate() - simulatedTime.getDay() + day);
};

const getCurrentTimeInSeconds = () => {
    const now = simulatedTime || getSacramentoTime();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
};

const currentDay = () => {
    return simulatedTime ? simulatedTime.getDay() : getSacramentoTime().getDay();
};

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600); // Получаем количество часов
    const minutes = Math.floor((seconds % 3600) / 60); // Получаем количество минут
    const remainingSeconds = seconds % 60; // Получаем оставшиеся секунды

    const formattedHours = hours > 0 ? `${hours}:` : ''; // Форматируем часы, если их есть
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`; // Форматируем минуты
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`; // Форматируем секунды

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

const getCurrentShift = () => {
    const currentTime = getCurrentTimeInSeconds();
    const shifts = ['shift1', 'shift2']; // Предполагаем, что у вас есть две смены: shift1 и shift2
    for (let shift of shifts) {
        const lessons = currentSchedule[currentDay()]?.[shift] || [];
        for (let lesson of lessons) {
            if (currentTime >= lesson.start && currentTime < lesson.end) {
                return shift;
            }
        }
    }
    return null;
};

const getCurrentLesson = (shift) => {
    const currentTime = getCurrentTimeInSeconds();
    const lessons = currentSchedule[currentDay()]?.[shift] || [];
    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        if (currentTime >= lesson.start && currentTime < lesson.end) {
            const timeLeft = lesson.end - currentTime;
            return {
                lessonName: lesson.lesson,
                timeLeft,
                isBreak: false,
                totalTime: lesson.end - lesson.start
            };
        }
        if (i < lessons.length - 1 && currentTime >= lesson.end && currentTime < lessons[i + 1].start) {
            const timeLeft = lessons[i + 1].start - currentTime;
            return {
                lessonName: "Cooldown",
                timeLeft,
                isBreak: true
            };
        }
    }
    return { lessonName: null, timeLeft: 0, isBreak: false, totalTime: 0 };
};

const updateCurrentLessons = () => {
    const currentLessonShift1 = getCurrentLesson('shift1');
    const updateShift = (shiftId, currentLesson) => {
        if (currentLesson.lessonName) {
            if (currentLesson.isBreak) {
                document.getElementById(`lesson${shiftId}`).innerHTML = "Cooldown";
                document.getElementById(`timeLeft${shiftId}`).innerHTML = formatTime(currentLesson.timeLeft);
                document.getElementById(`progress${shiftId}`).style.display = 'none';
            } else {
                document.getElementById(`lesson${shiftId}`).innerHTML = `${currentLesson.lessonName}`;
                document.getElementById(`timeLeft${shiftId}`).innerHTML = formatTime(currentLesson.timeLeft);
                const progress = ((currentLesson.totalTime - currentLesson.timeLeft) / currentLesson.totalTime) * 100;
                document.getElementById(`progress${shiftId}`).style.display = 'inline-block';
                document.getElementById(`progress${shiftId}`).value = progress;
            }
        } else {
            document.getElementById(`lesson${shiftId}`).innerHTML = "No lessons";
            document.getElementById(`timeLeft${shiftId}`).innerHTML = "";
            document.getElementById(`progress${shiftId}`).style.display = 'none';
        }
    };
    updateShift("Shift1", currentLessonShift1);
};

const schedules = [schedule1, schedule2];
let currentScheduleIndex = 0;

// Массив с именами, которые будут отображаться вместо чисел
const names = ['Oleg', 'Arseniy']; // Здесь можно добавить больше имён, если нужно
const prevButton = document.getElementById('prevSchedule');
const nextButton = document.getElementById('nextSchedule');


const updateButtonsState = () => {
    // Если на первом расписании, делаем кнопку "назад" полупрозрачной
    if (currentScheduleIndex === 0) {
        prevButton.classList.add('arrow-disabled');
    } else {
        prevButton.classList.remove('arrow-disabled');
    }

    // Если на последнем расписании, делаем кнопку "вперед" полупрозрачной
    if (currentScheduleIndex === schedules.length - 1) {
        nextButton.classList.add('arrow-disabled');
    } else {
        nextButton.classList.remove('arrow-disabled');
    }
};

prevButton.addEventListener('click', () => {
    if (currentScheduleIndex > 0) {
        currentScheduleIndex--;
        localStorage.setItem('currentScheduleIndex', currentScheduleIndex); // Сохраняем индекс
        updateSchedule(); // Обновить расписание с анимацией
        updateButtonsState(); // Обновить состояние кнопок
    }
});

nextButton.addEventListener('click', () => {
    if (currentScheduleIndex < schedules.length - 1) {
        currentScheduleIndex++;
        localStorage.setItem('currentScheduleIndex', currentScheduleIndex); // Сохраняем индекс
        updateSchedule(); // Обновить расписание с анимацией
        updateButtonsState(); // Обновить состояние кнопок
    }
});

// Функция для обновления расписания и дисплея
const updateSchedule = () => {
    const lessonInfo = document.getElementById('lesson-info'); // Получаем элемент для анимации

    // Добавляем класс shake для эффекта потряхивания
    lessonInfo.classList.add('shake');
    
    // Удаляем класс shake после завершения анимации (чтобы можно было повторно использовать)
    setTimeout(() => {
        lessonInfo.classList.remove('shake');
    }, 300); // Длительность анимации (500 мс)
    if (navigator.vibrate) {
            navigator.vibrate([5]);
        }
    // Обновляем текущее расписание
    
    currentSchedule = schedules[currentScheduleIndex];
    convertScheduleToSeconds(currentSchedule); // Переводим в секунды
    updateCurrentLessons(); // Обновляем текущие уроки
    updateScheduleDisplay(); // Обновляем отображение текущего расписания
    resetShift(); // Сбросить смену

    // Сохраняем текущий индекс расписания в localStorage
    localStorage.setItem('currentScheduleIndex', currentScheduleIndex);
};

if (localStorage.getItem('currentScheduleIndex')) {
    currentScheduleIndex = parseInt(localStorage.getItem('currentScheduleIndex'), 10);
    currentSchedule = schedules[currentScheduleIndex];
    convertScheduleToSeconds(currentSchedule); // Переводим в секунды
    updateCurrentLessons(); // Обновляем текущие уроки

}

// Функция для обновления текста текущего расписания
const updateScheduleDisplay = () => {
    const scheduleDisplay = document.getElementById('currentScheduleDisplay');
    
    // Отображаем имя вместо числа
    const displayName = names[currentScheduleIndex] || 'Неизвестный'; // На всякий случай, если индекс выходит за пределы массива
    scheduleDisplay.innerHTML = `${displayName}`;
};

// Сразу обновляем расписание при загрузке страницы
updateCurrentLessons();
updateScheduleDisplay();
// Инициализация состояния кнопок при загрузке страницы
updateButtonsState();

// Устанавливаем периодическое обновление расписания
const updateDisplayInterval = setInterval(() => {
    updateScheduleDisplay(); // Чтобы обновление дисплея происходило в цикле
    // Инициализация состояния кнопок при загрузке страницы
updateButtonsState();
}, 75);

// Устанавливаем периодическое обновление расписания
const updateLessonsInterval = setInterval(() => {
    //console.log('Current schedule:', currentScheduleIndex); // Для отладки
    updateCurrentLessons();
}, 1000);

window.simulateTime = simulateTime;

const sim = (input) => {
    const [day, time] = input.split("-");
    if (day && time) {
        simulateTime(parseInt(day), time);
        console.log(`Simulated time set to day ${day} at ${time}`);
    } else {
        console.error("Invalid input format. Use 'day-time' format, e.g., '1-10:30'.");
    }
};

window.sim = sim;

const debug = () => {
    simulateTime(1, "12:50");
    console.log("Debug time set to day 1 at 12:50");
};

window.debug = debug;

const logCurrentTime = () => {
    const now = simulatedTime || getSacramentoTime();
    console.log(`Current time is: ${now.toLocaleTimeString()}`);
};

window.logCurrentTime = logCurrentTime;

const logCurrentDay = () => {
    const now = simulatedTime || getSacramentoTime();
    console.log(`Current day is: ${now.getDay()}`);
};

window.logCurrentDay = logCurrentDay;

AOS.init({
    duration: 200,
    once: true
});

document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menuIcon");
    const toolsPanel = document.getElementById("toolsPanel");
    const links = toolsPanel.querySelectorAll('a');

    menuIcon.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        toolsPanel.classList.toggle("active");

        if (navigator.vibrate) {
            navigator.vibrate([5]);
        }
    });

    links.forEach(link => {
        link.addEventListener("click", (event) => {
            if (navigator.vibrate) {
                navigator.vibrate(5);
            }
        });
    });

    document.addEventListener("mousedown", (event) => {
        if (!toolsPanel.contains(event.target) && !menuIcon.contains(event.target)) {
            toolsPanel.classList.remove("active");
        }
    });
    
    const themeToggle = document.getElementById("themeToggle");
    themeToggle.addEventListener("click", () => {
        if (navigator.vibrate) {
            navigator.vibrate(5);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const snowflakesContainer = document.getElementById("snowflakes");
    const maxSnowflakes = 45;
    const snowflakes = [];

    // Функция создания снежинки
    function createSnowflake() {
        if (snowflakes.length >= maxSnowflakes) return; // Ограничиваем максимальное количество снежинок

        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");

        const size = Math.random() * 19 + 5;
        const leftPosition = Math.random() * 96;
        const animationDuration = Math.random() * 15 + 5;
        const rotation = Math.random() * 360;

        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${leftPosition}%`;
        snowflake.style.animationDuration = `${animationDuration}s`;
        snowflake.style.transform = `rotate(${rotation}deg)`;

        snowflakesContainer.appendChild(snowflake);
        snowflakes.push(snowflake); // Добавляем снежинку в массив

        // Удаляем снежинку после анимации
        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
            snowflakes.splice(snowflakes.indexOf(snowflake), 1); // Убираем снежинку из массива
        });
    }

    // Функция, которая будет вызываться регулярно для создания снежинок
    function snowflakesLoop() {
        createSnowflake();
        setTimeout(() => {
            requestAnimationFrame(snowflakesLoop); // Используем requestAnimationFrame для синхронизации с кадрами
        }, 300); // Пауза между созданием снежинок (можно настроить)
    }

    snowflakesLoop();
});

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");

    document.body.style.transition = "background-color 0.3s, color 0.3s";
    themeToggle.style.transition = "transform 0.4s ease-in-out, opacity 0.2s ease-in-out";
    document.documentElement.style.transition = "background-color 0.3s";

    themeToggle.style.opacity = "0";
    themeToggle.style.transform = "rotate(180deg)";

    function setTheme(theme) {
        if (theme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
            document.documentElement.style.backgroundColor = "#ffffff";
            themeToggle.style.backgroundImage = "url('images/sun.svg')";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            document.documentElement.style.backgroundColor = "#0e1213";
            themeToggle.style.backgroundImage = "url('images/moon.svg')";
        }
    }

    const savedTheme = localStorage.getItem("theme") || 
                      (window.matchMedia('(prefers-color-scheme: light)').matches ? "light" : "dark");
    setTheme(savedTheme);

    requestAnimationFrame(() => {
        themeToggle.style.opacity = "1";
        themeToggle.style.transform = "rotate(0deg)";
    });

    themeToggle.addEventListener("click", () => {
        themeToggle.style.transform = "rotate(180deg)";
        themeToggle.style.opacity = "0";
        
        setTimeout(() => {
            const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
            
            themeToggle.style.opacity = "1";
            themeToggle.style.transform = "rotate(0deg)";
        }, 200);
    });
});

let isFetchingFact = false;
let isTranslated = false;

// Проверка наличия сохранённого состояния
const lastTranslated = localStorage.getItem('lastTranslated');
if (lastTranslated) {
    isTranslated = lastTranslated === 'true';
}

function getFact() {
    if (isFetchingFact) return; // Prevent multiple simultaneous executions
    isFetchingFact = true;

    const factText = document.getElementById('fact-text');
    factText.textContent = '...'; // Показываем сообщение о загрузке

    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
        .then(response => response.json())
        .then(data => {
            const factContent = document.querySelector('.fact-content');
            factContent.style.opacity = '1';

            const txt = data.text;
            // Сначала проверяем, нужно ли переводить
            if (isTranslated) {
                translateFactWithAnimation(txt);  // Если нужно, сразу переводим и показываем
            } else {
                displayFactWithTyping(txt); // Если не нужно переводить, сразу показываем факт
            }

            // Добавляем обработчик на клик для перевода
            factText.onclick = () => {
                toggleTranslation(txt);
            };
        })
        .catch(error => {
            console.error('Ошибка при получении факта:', error);
            factText.textContent = 'Не удалось загрузить факт дня.';
            isFetchingFact = false; // Reset the flag in case of error
        });
}

function translateFactWithAnimation(text) {
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ru`)
        .then(response => response.json())
        .then(data => {
            if (data.responseStatus && data.responseStatus === 429) {
                const factText = document.getElementById('fact-text');
                factText.textContent = 'Ошибка лимита запросов. Попробуйте позже.';
                return;
            }

            const translatedText = data.responseData ? data.responseData.translatedText : 'Не удалось перевести факт.';
            displayFactWithTyping(translatedText); // Запускаем анимацию печатания переведенного текста

            isTranslated = true;
            localStorage.setItem('lastTranslated', 'true');
        })
        .catch(error => {
            console.error('Ошибка при переводе:', error);
            const factText = document.getElementById('fact-text');
            factText.textContent = 'Не удалось перевести факт.';
        });
}

function displayFactWithTyping(text) {
    const factText = document.getElementById('fact-text');
    factText.innerHTML = ''; // Очищаем текущий текст

    const typingSpan = document.createElement('span');
    typingSpan.className = 'typing-effect';
    factText.appendChild(typingSpan);

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typingSpan.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 15); // Увеличил задержку для медленного набора текста
        } else {
            isFetchingFact = false; // Сбрасываем флаг после завершения печати
        }
    }

    typeWriter(); // Начинаем анимацию печатания
}

function toggleTranslation(txt) {
    const factText = document.getElementById('fact-text');

    if (isTranslated) {
        // Fade-out before switching to English
        factText.style.transition = 'opacity 0.3s';
        factText.style.opacity = '0';

        setTimeout(() => {
            factText.textContent = txt;
            factText.style.opacity = '1';
            displayFactWithTyping(txt); // Применяем анимацию печатания
        }, 300); // Ждём окончания анимации перед заменой текста

        isTranslated = false;
        localStorage.setItem('lastTranslated', 'false');
    } else {
        translateFactWithAnimation(txt); // Переводим и показываем
    }
}

window.addEventListener('load', getFact);

/* Стили */
const style = document.createElement('style');
style.textContent = `
    .sectionz {
        transition: transform 0.3s, background-color 0.3s;
        display: inline-block;
        padding: 10px;
        border-radius: 5px;
    }
    #fact-text:hover {
        background-color: rgba(0, 0, 0, 0.06);
    }
    #fact-text:active {
        transform: scale(0.95);
        background-color: rgba(102, 178, 249, 0.26);
    }
`;
document.head.appendChild(style);
