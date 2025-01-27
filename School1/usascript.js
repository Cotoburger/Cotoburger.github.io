const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');
const socialIcons = document.querySelectorAll('.social-icon');

function pxToRem(px) {
    return px / 16 + 'rem';
}



const schedule = {
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
// Получить время в часовом поясе Сакраменто
const getSacramentoTime = () => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
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
                lessonName: "Cooldown",
                timeLeft,
                isBreak: true
            };
        }
    }

    return { lessonName: null, timeLeft: 0, isBreak: false, totalTime: 0 };
};

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
let isTranslated = false;  // Добавляем переменную для отслеживания языка

// Проверяем в localStorage, был ли последний раз перевод
const lastTranslated = localStorage.getItem('lastTranslated');

if (lastTranslated === 'true') {
    isTranslated = true;  // Если было переведено, сразу ставим флаг
}

function getFact() {
    if (isFetchingFact) return; // Prevent multiple simultaneous executions
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

            const txt = data.text;
            
            // Сначала перевести текст, а потом отображать
            if (isTranslated) {
                translateFactWithAnimation(txt);  // Если перевод, сразу переводим и показываем
            } else {
                // Если не нужно переводить, сразу показываем факт на английском
                displayFactWithTyping(txt);
            }

            // Add click listener for translation
            factText.onclick = () => {
                if (isTranslated) {
                    // Fade-out animation before switching back to English
                    factText.style.transition = 'opacity 0.2s';
                    factText.style.opacity = '0';

                    setTimeout(() => {
                        factText.textContent = txt;  // Возвращаем английский текст
                        factText.style.opacity = '1';  // Fade-in animation
                        displayFactWithTyping(txt); // Применяем анимацию печатания
                    }, 500); // Wait for the fade-out to complete before updating text

                    isTranslated = false;  // Сбрасываем флаг
                    localStorage.setItem('lastTranslated', 'false');  // Сохраняем в localStorage, что текст на английском
                } else {
                    translateFactWithAnimation(txt);
                }
            };
        })
        .catch(error => {
            console.error('Ошибка при получении факта:', error);
            document.getElementById('fact-text').textContent = 'Не удалось загрузить факт дня.';
            isFetchingFact = false; // Reset the flag in case of error
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
                    factText.textContent = 'API переводчика выдаёт ошибку о лимите запросов. Попробуйте позже.';
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

function displayFactWithTyping(text) {
    const factText = document.getElementById('fact-text');
    const typingSpan = document.querySelector('.typing-effect');

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typingSpan.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 10); // Adjust the speed of typing if needed
        } else {
            isFetchingFact = false; // Reset the flag once typing is complete
        }
    }

    typeWriter(); // Start typing effect
}

window.addEventListener('load', getFact);

/* Styles */
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