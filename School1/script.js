const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');
const socialIcons = document.querySelectorAll('.social-icon');

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
    }
};
const timeToSeconds = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60;
};

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

convertScheduleToSeconds(schedule);

let simulatedTime = null;

const simulateTime = (day, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    simulatedTime = new Date();
    simulatedTime.setHours(hours, minutes, 0, 0);
    simulatedTime.setDate(simulatedTime.getDate() - simulatedTime.getDay() + day);
};

const getCurrentTimeInSeconds = () => {
    const now = simulatedTime || new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
};

const currentDay = () => {
    return simulatedTime ? simulatedTime.getDay() : new Date().getDay();
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
};

const getCurrentLesson = (shift) => {
    const currentTime = getCurrentTimeInSeconds();
    const lessons = schedule[currentDay()]?.[shift] || [];

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
    { start: '2025-03-22', end: '2025-03-31' } // Весенние каникулы
];

// Функция для преобразования даты в строку формата 'YYYY-MM-DD'
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Функция для получения разницы в днях между двумя датами
const getDaysLeft = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end - currentDate;
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Возвращаем количество дней
};

// Функция для проверки, находится ли текущая дата в периоде каникул
const isHoliday = () => {
    const currentDate = formatDate(new Date());
    return holidays.some(holiday => currentDate >= holiday.start && currentDate <= holiday.end);
};

const getDaysLabel = (daysLeft) => {
    if (daysLeft % 10 === 1 && daysLeft % 100 !== 11) {
        return 'день';
    } else if (daysLeft % 10 >= 2 && daysLeft % 10 <= 4 && (daysLeft % 100 < 10 || daysLeft % 100 >= 20)) {
        return 'дня';
    } else {
        return 'дней';
    }
};

const updateCurrentLessons = () => {
    const currentLessonShift1 = getCurrentLesson('shift1');
    const currentLessonShift2 = getCurrentLesson('shift2');

    const isHolidayPeriod = isHoliday(); // Проверяем, каникулы ли сейчас

    const updateShift = (shiftId, currentLesson) => {
        document.getElementById(`currentLesson${shiftId}`).innerHTML = shiftId === "Shift1" ? `Первая смена` : `Вторая смена`;

        if (isHolidayPeriod) {
            const holiday = holidays.find(h => formatDate(new Date()) >= h.start && formatDate(new Date()) <= h.end);
            const start = new Date(holiday.start);
            const end = new Date(holiday.end);
            const totalDays = Math.ceil((end - start) / (1000 * 3600 * 24));
            const daysPassed = Math.ceil((new Date() - start) / (1000 * 3600 * 24));
            const daysLeft = totalDays - daysPassed;

            document.getElementById(`lesson${shiftId}`).innerHTML = `Каникулы `;
            document.getElementById(`timeLeft${shiftId}`).innerHTML = `осталось ~${daysLeft} ${getDaysLabel(daysLeft)}`;

            const progress = (daysPassed / totalDays) * 100;
            document.getElementById(`progress${shiftId}`).style.display = 'inline-block';
            document.getElementById(`progress${shiftId}`).value = progress;
        } else if (currentLesson.lessonName) {
            if (currentLesson.isBreak) {
                document.getElementById(`lesson${shiftId}`).innerHTML = "Перемена";
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
            document.getElementById(`lesson${shiftId}`).innerHTML = "Нет уроков";
            document.getElementById(`timeLeft${shiftId}`).innerHTML = "";
            document.getElementById(`progress${shiftId}`).style.display = 'none';
        }
    };

    updateShift("Shift1", currentLessonShift1);
    updateShift("Shift2", currentLessonShift2);
};

updateCurrentLessons();

setInterval(updateCurrentLessons, 1000);

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
    const now = simulatedTime || new Date();
    console.log(`Current time is: ${now.toLocaleTimeString()}`);
};

window.logCurrentTime = logCurrentTime;
const logCurrentDay = () => {
    const now = simulatedTime || new Date();
    console.log(`Current day is: ${now.getDay()}`);
};

window.logCurrentDay = logCurrentDay;

AOS.init({
    duration: 200,
    once: true
    
}); 

document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menuIcon");
    const links = toolsPanel.querySelectorAll('a');


    links.forEach(link => {
        link.addEventListener("click", (event) => {
            if (navigator.vibrate) {
                navigator.vibrate(5);
            }
        });
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

    function createSnowflake() {
        if (snowflakesContainer.children.length >= maxSnowflakes) {
            return;
        }

        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");

        const size = Math.random() * 19 + 5;
        const leftPosition = Math.random() * 96;
        const animationDuration = Math.random() * 15 + 5;

        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${leftPosition}%`;
        snowflake.style.animationDuration = `${animationDuration}s`;

        const rotation = Math.random() * 360;
        snowflake.style.transform = `rotate(${rotation}deg)`;

        snowflakesContainer.appendChild(snowflake);

        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
        });
    }

    function snowflakesLoop() {
        createSnowflake();
        setTimeout(() => {
            requestAnimationFrame(snowflakesLoop);
        }, 300);
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
let isTranslated = false;  // Флаг для отслеживания перевода

// При загрузке страницы проверяем состояние перевода в localStorage
const lastTranslated = localStorage.getItem('lastTranslated');
if (lastTranslated === 'true') {
    isTranslated = true;  // Если перевод был, ставим флаг
}

function getFact() {
    if (isFetchingFact) return; // Предотвращаем одновременные запросы
    isFetchingFact = true;

    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
        .then(response => response.json())
        .then(data => {
            const factContent = document.querySelector('.fact-content');
            const factText = document.getElementById('fact-text');

            factContent.style.opacity = '1';
            factText.innerHTML = '';
            factText.style.opacity = '1';

            const typingSpan = document.createElement('span');
            typingSpan.className = 'typing-effect';
            factText.appendChild(typingSpan);

            let i = 0;
            const txt = data.text; // Сохраняем текст факта на английском

            // Функция для анимации печати текста
            function typeWriter() {
                if (i < txt.length) {
                    typingSpan.textContent += txt.charAt(i);
                    i++;
                    setTimeout(typeWriter, 10); // Скорость печати
                } else {
                    isFetchingFact = false; // Завершаем запрос
                }
            }

            if (txt) {
                typeWriter(); // Запускаем анимацию печати
            }

            // Обработчик клика для переключения между языками
            factText.onclick = () => {
                if (isTranslated) {
                    // Если текст уже переведен, возвращаем на английский
                    factText.style.transition = 'opacity 0.2s';
                    factText.style.opacity = '0';

                    setTimeout(() => {
                        factText.textContent = txt;  // Возвращаем английский текст
                        factText.style.opacity = '1';  // Плавно показываем его
                    }, 500); // Ждем окончания анимации перед обновлением текста

                    isTranslated = false;  // Сбрасываем флаг перевода
                    localStorage.setItem('lastTranslated', 'false');  // Сохраняем в localStorage
                } else {
                    translateFactWithAnimation(txt);  // Переводим факт
                }
            };
        })
        .catch(error => {
            console.error('Ошибка при получении факта:', error);
            document.getElementById('fact-text').textContent = 'Не удалось загрузить факт дня.';
            isFetchingFact = false; // Сбрасываем флаг в случае ошибки
        });
}

function translateFactWithAnimation(text) {
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ru`)
        .then(response => response.json())
        .then(data => {
            // Проверяем на наличие ошибки в API, если лимит исчерпан
            if (data.responseStatus && data.responseStatus === 429) {
                const factText = document.getElementById('fact-text');
                factText.style.transition = 'opacity 0.2s';
                factText.style.opacity = '0';

                setTimeout(() => {
                    factText.textContent = 'Лимит бесплатных переводов исчерпан. Попробуйте позже.';
                    factText.style.opacity = '1';
                }, 500);
                return;  // Прерываем выполнение, если лимит исчерпан
            }

            // Если ошибок нет, продолжаем с переводом
            const translatedText = data.responseData ? data.responseData.translatedText : 'Не удалось перевести факт.';
            const factText = document.getElementById('fact-text');

            // Сначала скрываем текст
            factText.style.transition = 'opacity 0.2s';
            factText.style.opacity = '0';

            setTimeout(() => {
                // После перевода показываем новый текст с анимацией печатания
                factText.innerHTML = ''; // Очищаем текст, чтобы применить анимацию
                const typingSpan = document.createElement('span');
                typingSpan.className = 'typing-effect';
                factText.appendChild(typingSpan);

                displayFactWithTyping(translatedText); // Запускаем анимацию печатания переведенного текста

                factText.style.opacity = '1';
                isTranslated = true;  // Устанавливаем флаг, что текст переведен
                localStorage.setItem('lastTranslated', 'true');  // Сохраняем в localStorage, что текст переведен
            }, 500); // Wait for the fade-out to complete before updating text
        })
        .catch(error => {
            console.error('Ошибка при переводе:', error);
            const factText = document.getElementById('fact-text');
            factText.style.transition = 'opacity 0.2s';
            factText.style.opacity = '0';

            setTimeout(() => {
                factText.textContent = 'Не удалось перевести факт.';
                factText.style.opacity = '1';
            }, 500);
        });
}

window.addEventListener('load', getFact); // Запуск при загрузке страницы

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


