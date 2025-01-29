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
            navigator.vibrate([50]);
        }
    // Обновляем текущее расписание
    
    currentSchedule = schedules[currentScheduleIndex];
    convertScheduleToSeconds(currentSchedule); // Переводим в секунды
    updateCurrentLessons(); // Обновляем текущие уроки
    updateScheduleDisplay(); // Обновляем отображение текущего расписания

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
