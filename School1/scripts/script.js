
function pxToRem(px) {
    return px / 16 + 'rem';
}



const schedule = {
    1: {
        shift1: [
            {lesson: "Классный час", start: "08:15", end: "08:45"},
            {lesson: "1-й урок", start: "08:55", end: "09:35"},
            {lesson: "2-й урок", start: "09:50", end: "10:30"},
            {lesson: "3-й урок", start: "10:45", end: "11:25"},
            {lesson: "4-й урок", start: "11:30", end: "12:10"},
            {lesson: "5-й урок", start: "12:20", end: "13:00"},
            {lesson: "6-й урок", start: "13:20", end: "14:00"},
            {lesson: "7-й урок", start: "14:15", end: "14:55"},
        ],
        shift2: [
            {lesson: "0-й урок", start: "12:20", end: "13:00"},
            {lesson: "1-й урок", start: "13:20", end: "14:00"},
            {lesson: "2-й урок", start: "14:15", end: "14:55"},
            {lesson: "3-й урок", start: "15:10", end: "15:50"},
            {lesson: "Классный час", start: "16:05", end: "16:35"},
            {lesson: "4-й урок", start: "16:40", end: "17:20"},
            {lesson: "5-й урок", start: "17:30", end: "18:10"},
            {lesson: "6-й урок", start: "18:20", end: "19:00"},
        ]
    },
    2: {
        shift1: [
            {lesson: "1-й урок", start: "08:15", end: "08:55"},
            {lesson: "2-й урок", start: "09:05", end: "09:45"},
            {lesson: "3-й урок", start: "10:00", end: "10:40"},
            {lesson: "4-й урок", start: "11:00", end: "11:40"},
            {lesson: "5-й урок", start: "11:50", end: "12:30"},
            {lesson: "6-й урок", start: "12:50", end: "13:30"},
            {lesson: "7-й урок", start: "13:50", end: "14:30"},
        ],
        shift2: [
            {lesson: "0-й урок", start: "11:50", end: "12:30"},
            {lesson: "1-й урок", start: "12:50", end: "13:30"},
            {lesson: "2-й урок", start: "13:50", end: "14:30"},
            {lesson: "3-й урок", start: "14:45", end: "15:25"},
            {lesson: "4-й урок", start: "15:40", end: "16:20"},
            {lesson: "5-й урок", start: "16:30", end: "17:10"},
            {lesson: "6-й урок", start: "17:20", end: "18:00"},
        ]
    },
    3: {
        shift1: [
            {lesson: "1-й урок", start: "08:15", end: "08:55"},
            {lesson: "2-й урок", start: "09:05", end: "09:45"},
            {lesson: "3-й урок", start: "10:00", end: "10:40"},
            {lesson: "Классный час", start: "10:55", end: "11:25"},
            {lesson: "4-й урок", start: "11:30", end: "12:10"},
            {lesson: "5-й урок", start: "12:20", end: "13:00"},
            {lesson: "6-й урок", start: "13:20", end: "14:00"},
            {lesson: "7-й урок", start: "14:15", end: "14:55"},
        ],
        shift2: [
            {lesson: "0-й урок", start: "12:20", end: "13:00"},
            {lesson: "1-й урок", start: "13:20", end: "14:00"},
            {lesson: "2-й урок", start: "14:15", end: "14:55"},
            {lesson: "3-й урок", start: "15:10", end: "15:50"},
            {lesson: "Классный час", start: "16:05", end: "16:35"},
            {lesson: "4-й урок", start: "16:40", end: "17:20"},
            {lesson: "5-й урок", start: "17:30", end: "18:10"},
            {lesson: "6-й урок", start: "18:20", end: "19:00"},
        ]
    },
    4: {
        shift1: [
            {lesson: "1-й урок", start: "08:15", end: "08:55"},
            {lesson: "2-й урок", start: "09:05", end: "09:45"},
            {lesson: "3-й урок", start: "10:00", end: "10:40"},
            {lesson: "Классный час", start: "10:55", end: "11:25"},
            {lesson: "4-й урок", start: "11:30", end: "12:10"},
            {lesson: "5-й урок", start: "12:20", end: "13:00"},
            {lesson: "6-й урок", start: "13:20", end: "14:00"},
            {lesson: "7-й урок", start: "14:15", end: "14:55"},
        ],
        shift2: [
            {lesson: "0-й урок", start: "12:20", end: "13:00"},
            {lesson: "1-й урок", start: "13:20", end: "14:00"},
            {lesson: "2-й урок", start: "14:15", end: "14:55"},
            {lesson: "3-й урок", start: "15:10", end: "15:50"},
            {lesson: "Классный час", start: "16:05", end: "16:35"},
            {lesson: "4-й урок", start: "16:40", end: "17:20"},
            {lesson: "5-й урок", start: "17:30", end: "18:10"},
            {lesson: "6-й урок", start: "18:20", end: "19:00"},
        ]
    },
    5: {
        shift1: [
            {lesson: "1-й урок", start: "08:15", end: "08:55"},
            {lesson: "2-й урок", start: "09:05", end: "09:45"},
            {lesson: "3-й урок", start: "10:00", end: "10:40"},
            {lesson: "4-й урок", start: "11:00", end: "11:40"},
            {lesson: "5-й урок", start: "11:50", end: "12:30"},
            {lesson: "6-й урок", start: "12:50", end: "13:30"},
            {lesson: "7-й урок", start: "13:50", end: "14:30"},
        ],
        shift2: [
            {lesson: "0-й урок", start: "11:50", end: "12:30"},
            {lesson: "1-й урок", start: "12:50", end: "13:30"},
            {lesson: "2-й урок", start: "13:50", end: "14:30"},
            {lesson: "3-й урок", start: "14:45", end: "15:25"},
            {lesson: "4-й урок", start: "15:40", end: "16:20"},
            {lesson: "5-й урок", start: "16:30", end: "17:10"},
            {lesson: "6-й урок", start: "17:20", end: "18:00"},
           // {lesson: "ДЕБАГ", start: "00:00", end: "24:00"},
        ]
    },
    6: {
        shift1: [
            {lesson: "Суббота", start: "00:01", end: "23:59"},
        ],
        shift2: [
            {lesson: "Суббота", start: "00:01", end: "23:59"},
        ]
    },
    7: {
        shift1: [
            {lesson: "Воскресенье", start: "00:01", end: "23:59"},
        ],
        shift2: [
            {lesson: "Воскресенье", start: "00:01", end: "23:59"},
        ]
    }
};

// Получаем время в часовом поясе Сакраменто
const getSacramentoTime = () => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kamchatka" }));
};

// Преобразование времени в секунды
const timeToSeconds = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60;
};

// Преобразование расписания в секунды
const convertScheduleToSeconds = (schedule) => {
    for (let day in schedule) {
        for (let shift in schedule[day]) {
            schedule[day][shift].forEach(lesson => {
                lesson.start = timeToSeconds(lesson.start);
                lesson.end = timeToSeconds(lesson.end);
            });
        }
    }
};

// Предполагается, что schedule уже определён где-то
convertScheduleToSeconds(schedule);

let simulatedTime = null;

// Симуляция времени (если нужно для теста)
const simulateTime = (day, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    simulatedTime = getSacramentoTime();
    simulatedTime.setHours(hours, minutes, 0, 0);
    simulatedTime.setDate(simulatedTime.getDate() - simulatedTime.getDay() + day);
};

// Получение времени в секундах
const getCurrentTimeInSeconds = () => {
    const now = simulatedTime || getSacramentoTime();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
};

// Получение текущего дня
const currentDay = () => {
    return simulatedTime ? simulatedTime.getDay() : getSacramentoTime().getDay();
};

// Форматирование времени (HH:MM:SS)
const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

// Получение текущего урока для указанной смены
const getCurrentLesson = (shift) => {
    const currentTime = getCurrentTimeInSeconds();
    const lessons = schedule[currentDay()]?.[shift] || [];

    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];

        // Если текущее время попадает в урок
        if (currentTime >= lesson.start && currentTime < lesson.end) {
            const timeLeft = lesson.end - currentTime;
            return {
                lessonName: lesson.lesson,
                timeLeft,
                isBreak: false,
                totalTime: lesson.end - lesson.start
            };
        }

        // Если между уроками (перемена)
        if (i < lessons.length - 1 && currentTime >= lesson.end && currentTime < lessons[i + 1].start) {
            const timeLeft = lessons[i + 1].start - currentTime;
            return {
                lessonName: "Перемена",
                timeLeft,
                isBreak: true
            };
        }
    }

    return { lessonName: null, timeLeft: 0, isBreak: false, totalTime: 0 };
};

// Массив с датами каникул
const holidays = [
    { start: '2024-12-28', end: '2025-01-08' }, // Зимние каникулы
    { start: '2025-03-22', end: '2025-03-31' }  // Весенние каникулы
];

// Преобразование даты в строку формата 'YYYY-MM-DD'
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Получение количества дней до заданной даты
const getDaysLeft = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end - currentDate;
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Функция для определения правильного окончания слова "день"
const getDaysLabel = (days) => {
    if (days === 1) return "день";
    if (days >= 2 && days <= 4) return "дня";
    return "дней";
};

// Переменная для отслеживания статуса каникул
let isHolidayPeriod = false;
const checkHolidayStatus = () => {
    const currentDate = formatDate(new Date());
    isHolidayPeriod = holidays.some(holiday => currentDate >= holiday.start && currentDate <= holiday.end);
};
const formatToHHMM = (seconds) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
};
// Проверка статуса каникул каждые 10 секунд
setInterval(checkHolidayStatus, 10000);

// Функция для обновления информации о текущих уроках и прикрепления обработчиков клика
const updateCurrentLessons = () => {
    const currentLessonShift1 = getCurrentLesson('shift1');
    const currentLessonShift2 = getCurrentLesson('shift2');

    const updateShift = (shiftId, currentLesson) => {
        const shiftElement = document.getElementById(`currentLesson${shiftId}`);
    shiftElement.style.cursor = 'pointer';
    shiftElement.onclick = () => {
        const nextLesson = getNextLesson(shiftId.toLowerCase());
        const panel = document.getElementById('nextLessonPanel');
        
        if (!nextLesson) {
            panel.innerHTML = `<div class="panelContent">Нет следующих уроков</div>`;
        } else {
            const timeUntil = nextLesson.start - getCurrentTimeInSeconds();
            panel.innerHTML = `
                <div class="panelContent">
                    <h3>${nextLesson.lesson}</h3>
                    <p>Начало: ${formatToHHMM(nextLesson.start)}</p>
                    <p>Конец: ${formatToHHMM(nextLesson.end)}</p>
                    <p>До начала: ${formatTime(timeUntil)}</p>
                </div>
            `;
        }
        
        panel.style.transform = "translateY(0)";
    };
        if (isHolidayPeriod) {
            const holiday = holidays.find(h => formatDate(new Date()) >= h.start && formatDate(new Date()) <= h.end);
            const start = new Date(holiday.start);
            const end = new Date(holiday.end);
            const totalDays = Math.ceil((end - start) / (1000 * 3600 * 24));
            const daysPassed = Math.ceil((new Date() - start) / (1000 * 3600 * 24));
            const daysLeft = totalDays - daysPassed;

            document.getElementById(`lesson${shiftId}`).innerHTML = "Каникулы";
            document.getElementById(`timeLeft${shiftId}`).innerHTML = `Осталось ~${daysLeft} ${getDaysLabel(daysLeft)}`;

            const progress = (daysPassed / totalDays) * 100;
            document.getElementById(`progress${shiftId}`).style.display = 'inline-block';
            document.getElementById(`progress${shiftId}`).value = progress;
        } else if (currentLesson.lessonName) {
            if (currentLesson.isBreak) {
                document.getElementById(`lesson${shiftId}`).innerHTML = "Перемена";
                document.getElementById(`timeLeft${shiftId}`).innerHTML =
                  `<span style="color: green;">${formatTime(currentLesson.timeLeft)}</span>` +
                  `<span style="color: rgba(97, 123, 141, 0.63); float: right;">${formatTime(currentLesson.timeLeft)}</span>`;
                document.getElementById(`progress${shiftId}`).style.display = 'none';
            } else {
                document.getElementById(`lesson${shiftId}`).innerHTML = `${currentLesson.lessonName}`;
                document.getElementById(`timeLeft${shiftId}`).innerHTML =
                  `<span>${formatTime(currentLesson.timeLeft)}</span>` +
                  `<span style="color:rgba(97, 123, 141, 0.63); float: right;">${formatTime(currentLesson.totalTime)}</span>`;

                const progress = ((currentLesson.totalTime - currentLesson.timeLeft) / currentLesson.totalTime) * 100;
                document.getElementById(`progress${shiftId}`).style.display = 'inline-block';
                document.getElementById(`progress${shiftId}`).value = progress;
            }
        } else {
            document.getElementById(`lesson${shiftId}`).innerHTML = "Нет уроков";
            document.getElementById(`timeLeft${shiftId}`).innerHTML = "";
            document.getElementById(`progress${shiftId}`).style.display = 'none';
        }
        
        // Прикрепляем обработчик клика для показа панели следующего урока
        document.getElementById(`currentLesson${shiftId}`).onclick = () => {
            showNextLessonPanel(shiftId.toLowerCase());
        };
    };
// Добавьте этот обработчик для закрытия панели
document.addEventListener('click', (e) => {
    const panel = document.getElementById('nextLessonPanel');
    if (!panel.contains(e.target) && !e.target.closest('.current-lesson')) {
        panel.style.transform = "translateY(100%)";
    }
});
    updateShift("Shift1", currentLessonShift1);
    updateShift("Shift2", currentLessonShift2);
};

updateCurrentLessons()


// Обновляем данные каждые 1 секунду
setInterval(updateCurrentLessons, 1000);

// Обработчик клика вне панели для её скрытия
document.addEventListener('click', (e) => {
    const panel = document.getElementById('nextLessonPanel');
    // Если клик не по панели и не по текущим урокам – скрываем панель
    if (!panel.contains(e.target) && 
        !e.target.matches('#currentLessonShift1, #currentLessonShift2')) {
        hideNextLessonPanel();
    }
});


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
    duration: 200,          // Продолжительность анимации
    once: true,            // Анимация будет повторяться каждый раз при видимости элемента
    offset: 0,              // Анимация начинается сразу, как только элемент попадает в область видимости
    delay: 0,               // Задержка до начала анимации
});

