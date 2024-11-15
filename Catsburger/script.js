// Находим все изображения на странице и аватарку, а также изображения соцсетей
const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');
const socialIcons = document.querySelectorAll('.social-icon'); // Изображения соцсетей

// Инициализация Swiper
const swiper = new Swiper('.swiper-container', {
    spaceBetween: parseFloat(pxToRem(20)), // Используем rem вместо пикселей
    slidesPerView: 'auto',
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

// Функция для конвертации px в rem (предполагаем, что 1rem = 16px)
function pxToRem(px) {
    return px / 16 + 'rem';
}

// Ждем, пока страница полностью загрузится
window.addEventListener('DOMContentLoaded', () => {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(() => {
            const h1h2Elements = document.querySelectorAll('h1, h2'); // Все заголовки h1 и h2
            const avtextElement = document.querySelector('.avtext'); // Ваш никнейм
            const scheduleElements = document.querySelectorAll('#lesson-info .sectionles, #lesson-info .time-left, .local-time'); // Элементы расписания
            const isScrolled = window.scrollY > 400; // Проверка прокрутки (400px)

            // Изменяем цвета для всех элементов, кроме погоды
            if (isScrolled) {
                changeStyles('#02090e', '#4f99c1', '#1a4b8e'); //фон текст заголовки
            } else {
                changeStyles('#000000', '#b9b4b4', '#78b89a');
            }

            // Функция для изменения стилей
            function changeStyles(bgColor, textColor, elementsColor) {
                // Изменяем цвет фона и текста страницы
                document.body.style.backgroundColor = bgColor;
                document.body.style.color = textColor;

                // Изменяем цвет заголовков h1 и h2
                h1h2Elements.forEach((el) => {
                    el.style.color = elementsColor;
                });

                // Изменяем цвет элементов расписания
                scheduleElements.forEach((el) => {
                    el.style.color = elementsColor;
                    el.style.transition = 'color 0.3s ease'; // Плавное изменение цвета
                });

                // Изменяем цвет никнейма
                if (avtextElement) {
                    avtextElement.style.color = elementsColor;
                    avtextElement.style.transition = 'color 0.3s ease'; // Плавное изменение цвета
                }
            }
        });
    });
});
const video = document.getElementById('background-video');

// Устанавливаем начальную громкость и запускаем видео без звука
video.volume = 0;
let isFading = false;

// Создаем Intersection Observer для отслеживания видимости видео
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Когда видео видно на экране, плавно включаем звук
            fadeInVolume(video);
        } else {
            // Когда видео выходит из зоны видимости, плавно уменьшаем звук
            fadeOutVolume(video);
        }
    });
}, {
    threshold: 0.3 // Эффект запускается, если видео видно на 30%
});

// Наблюдаем за видео
observer.observe(video);

// Функция для плавного увеличения громкости
function fadeInVolume(videoElement) {
    if (isFading) return;
    isFading = true;
    const fadeInInterval = setInterval(() => {
        if (videoElement.volume < 0.6) {
            videoElement.volume = Math.min(videoElement.volume + 0.05, 1);
        } else {
            clearInterval(fadeInInterval);
            isFading = false;
        }
    }, 20);
}

// Функция для плавного уменьшения громкости
function fadeOutVolume(videoElement) {
    if (isFading) return;
    isFading = true;
    const fadeOutInterval = setInterval(() => {
        if (videoElement.volume > 0.1) {
            videoElement.volume = Math.max(videoElement.volume - 0.05, 0);
        } else {
            clearInterval(fadeOutInterval);
            isFading = false;
        }
    }, 20);
}

// Ваш API-ключ OpenWeatherMap
const apiKey = 'bf6fe63e6eb2ba55bb0fffe350177538';
const city = 'Petropavlovsk-Kamchatsky, RU';
const weatherIcon = document.getElementById('weather-icon');
async function getWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`);
        if (!response.ok) {
            throw new Error('Ошибка при получении данных о погоде');
        }
        const data = await response.json();
        updateWeatherIcon(data);
    } catch (error) {
        console.error(error.message);
        weatherIcon.textContent = '⚠️';
        document.getElementById('weather-error').textContent = 'Не удалось получить данные о погоде';
    }
}

function updateWeatherIcon(data) {
    const weather = data.weather[0].main.toLowerCase();
    const description = data.weather[0].description;
    let icon = '';

    if (weather.includes('snow')) {
        icon = '❄️';
    } else if (weather.includes('rain') || weather.includes('drizzle')) {
        icon = '🌧️';
    } else if (weather.includes('thunderstorm')) {
        icon = '⛈️';
    } else if (weather.includes('cloud')) {
        icon = '☁️';
    } else if (weather.includes('clear')) {
        icon = '☀️';
    } else if (weather.includes('mist') || weather.includes('fog')) {
        icon = '🌫️';
    } else {
        icon = '🌈';
    }

    weatherIcon.textContent = `${icon} ${description}`;
}

getWeather();

async function getWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`);
        if (!response.ok) {
            throw new Error('Ошибка при получении данных о погоде');
        }
        const data = await response.json();

        // Проверка на наличие данных
        if (data && data.weather && data.weather[0]) {
            updateWeatherIcon(data);
        } else {
            throw new Error('Некорректные данные о погоде');
        }
    } catch (error) {
        console.error(error.message);
        weatherIcon.textContent = '⚠️';
        document.getElementById('weather-error').textContent = 'Не удалось получить данные о погоде';
    }
}

// Функция для отображения текущего времени в Петропавловске-Камчатском
function updateKamchatkaTime() {
    const timeElement = document.getElementById("local-time");
    const options = {
        timeZone: 'Asia/Kamchatka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    const currentTime = new Intl.DateTimeFormat('ru-RU', options).format(new Date());
    timeElement.textContent = `time: ${currentTime}`;
}

// Обновляем время каждую секунду
setInterval(updateKamchatkaTime, 1000);
updateKamchatkaTime();

document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: true,
    });
});



const schedule = {
    1: {
        shift1: [
            {lesson: "Class Hour", start: "08:15", end: "08:45"},
            {lesson: "1st Lesson", start: "08:55", end: "09:35"},
            {lesson: "2nd Lesson", start: "09:50", end: "10:30"},
            {lesson: "3rd Lesson", start: "10:45", end: "11:25"},
            {lesson: "4th Lesson", start: "11:30", end: "12:10"},
            {lesson: "5th Lesson", start: "12:20", end: "13:00"},
            {lesson: "6th Lesson", start: "13:20", end: "14:00"},
            {lesson: "7th Lesson", start: "14:15", end: "14:55"}
        ],
        shift2: [
            {lesson: "0th Lesson", start: "12:20", end: "13:00"},
            {lesson: "1st Lesson", start: "13:20", end: "14:00"},
            {lesson: "2nd Lesson", start: "14:15", end: "14:55"},
            {lesson: "3rd Lesson", start: "15:10", end: "15:50"},
            {lesson: "Class Hour", start: "16:05", end: "16:35"},
            {lesson: "4th Lesson", start: "16:40", end: "17:20"},
            {lesson: "5th Lesson", start: "17:30", end: "18:10"},
            {lesson: "6th Lesson", start: "18:20", end: "19:00"}
        ]
    },
    2: {
        shift1: [
            {lesson: "1st Lesson", start: "08:15", end: "08:55"},
            {lesson: "2nd Lesson", start: "09:05", end: "09:45"},
            {lesson: "3rd Lesson", start: "10:00", end: "10:40"},
            {lesson: "4th Lesson", start: "11:00", end: "11:40"},
            {lesson: "5th Lesson", start: "11:50", end: "12:30"},
            {lesson: "6th Lesson", start: "12:50", end: "13:30"},
            {lesson: "7th Lesson", start: "13:50", end: "14:30"}
        ],
        shift2: [
            {lesson: "0th Lesson", start: "11:50", end: "12:30"},
            {lesson: "1st Lesson", start: "12:50", end: "13:30"},
            {lesson: "2nd Lesson", start: "13:50", end: "14:30"},
            {lesson: "3rd Lesson", start: "14:45", end: "15:25"},
            {lesson: "4th Lesson", start: "15:40", end: "16:20"},
            {lesson: "5th Lesson", start: "16:30", end: "17:10"},
            {lesson: "6th Lesson", start: "17:20", end: "18:00"}
        ]
    },
    3: {
        shift1: [
            {lesson: "1st Lesson", start: "08:15", end: "08:55"},
            {lesson: "2nd Lesson", start: "09:05", end: "09:45"},
            {lesson: "3rd Lesson", start: "10:00", end: "10:40"},
            {lesson: "Class Hour", start: "10:55", end: "11:25"},
            {lesson: "4th Lesson", start: "11:30", end: "12:10"},
            {lesson: "5th Lesson", start: "12:20", end: "13:00"},
            {lesson: "6th Lesson", start: "13:20", end: "14:00"},
            {lesson: "7th Lesson", start: "14:15", end: "14:55"}
        ],
        shift2: [
            {lesson: "0th Lesson", start: "12:20", end: "13:00"},
            {lesson: "1st Lesson", start: "13:20", end: "14:00"},
            {lesson: "2nd Lesson", start: "14:15", end: "14:55"},
            {lesson: "3rd Lesson", start: "15:10", end: "15:50"},
            {lesson: "Class Hour", start: "16:05", end: "16:35"},
            {lesson: "4th Lesson", start: "16:40", end: "17:20"},
            {lesson: "5th Lesson", start: "17:30", end: "18:10"},
            {lesson: "6th Lesson", start: "18:20", end: "19:00"}
        ]
    },
    4: {
        shift1: [
            {lesson: "1st Lesson", start: "08:15", end: "08:55"},
            {lesson: "2nd Lesson", start: "09:05", end: "09:45"},
            {lesson: "3rd Lesson", start: "10:00", end: "10:40"},
            {lesson: "Class Hour", start: "10:55", end: "11:25"},
            {lesson: "4th Lesson", start: "11:30", end: "12:10"},
            {lesson: "5th Lesson", start: "12:20", end: "13:00"},
            {lesson: "6th Lesson", start: "13:20", end: "14:00"},
            {lesson: "7th Lesson", start: "14:15", end: "14:55"}
        ],
        shift2: [
            {lesson: "0th Lesson", start: "12:20", end: "13:00"},
            {lesson: "1st Lesson", start: "13:20", end: "14:00"},
            {lesson: "2nd Lesson", start: "14:15", end: "14:55"},
            {lesson: "3rd Lesson", start: "15:10", end: "15:50"},
            {lesson: "Class Hour", start: "16:05", end: "16:35"},
            {lesson: "4th Lesson", start: "16:40", end: "17:20"},
            {lesson: "5th Lesson", start: "17:30", end: "18:10"},
            {lesson: "6th Lesson", start: "18:20", end: "19:00"}
        ]
    },
    5: {
        shift1: [
            {lesson: "1st Lesson", start: "08:15", end: "08:55"},
            {lesson: "2nd Lesson", start: "09:05", end: "09:45"},
            {lesson: "3rd Lesson", start: "10:00", end: "10:40"},
            {lesson: "4th Lesson", start: "11:00", end: "11:40"},
            {lesson: "5th Lesson", start: "11:50", end: "12:30"},
            {lesson: "6th Lesson", start: "12:50", end: "13:30"},
            {lesson: "7th Lesson", start: "13:50", end: "14:30"}
        ],
        shift2: [
            {lesson: "0th Lesson", start: "11:50", end: "12:30"},
            {lesson: "1st Lesson", start: "12:50", end: "13:30"},
            {lesson: "2nd Lesson", start: "13:50", end: "14:30"},
            {lesson: "3rd Lesson", start: "14:45", end: "15:25"},
            {lesson: "4th Lesson", start: "15:40", end: "16:20"},
            {lesson: "5th Lesson", start: "16:30", end: "17:10"},
            {lesson: "6th Lesson", start: "17:20", end: "18:00"}
        ]
    }
};
// Функция для перевода времени в секунды с полуночи
const timeToSeconds = (time) => {
    const [hours, minutes] = time.split(":").map(Number); // Разбиваем строку на часы и минуты
    return hours * 3600 + minutes * 60; // Переводим в секунды
};

// Обновляем расписание, преобразуя времена в секунды
const convertScheduleToSeconds = (schedule) => {
    for (let day in schedule) {
        for (let shift in schedule[day]) {
            schedule[day][shift].forEach(lesson => {
                lesson.start = timeToSeconds(lesson.start); // Конвертируем время начала
                lesson.end = timeToSeconds(lesson.end); // Конвертируем время окончания
            });
        }
    }
};

// Преобразуем расписание в секунды
convertScheduleToSeconds(schedule);

// Функция для перевода текущего времени в секунды с полуночи
const getCurrentTimeInSeconds = () => {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
};

// Получаем текущий день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
const currentDay = new Date().getDay();

// Функция для нахождения текущего урока для указанной смены
const getCurrentLesson = (shift) => {
    const currentTime = getCurrentTimeInSeconds(); // получаем текущее время в секундах

    // Проверяем уроки только для текущего дня (currentDay)
    const lessons = schedule[currentDay][shift]; // получаем уроки для текущего дня и смены

    for (let lesson of lessons) {
        // Убедимся, что текущее время попадает в промежуток урока
        if (currentTime >= lesson.start && currentTime < lesson.end) {
            // Время до конца урока
            const timeLeft = lesson.end - currentTime;
            const minutesLeft = Math.floor(timeLeft / 60); // оставшееся время в минутах

            // Возвращаем объект с названием урока и временем до конца
            return {
                lessonName: lesson.lesson, // название урока
                timeLeft: minutesLeft, // оставшееся время в минутах
            };
        }
    }

    return { lessonName: null, timeLeft: 0 }; // если урока нет в этот момент
};

const updateCurrentLessons = () => {
    // Определяем текущий урок для смены shift1 и shift2
    const currentLessonShift1 = getCurrentLesson('shift1');
    const currentLessonShift2 = getCurrentLesson('shift2');

    // Обновляем информацию для 1-й смены
    document.getElementById("currentLessonShift1").innerHTML = `1st shift`;
    if (currentLessonShift1.lessonName) {
        document.getElementById("lessonShift1").innerHTML = `${currentLessonShift1.lessonName}`;
        document.getElementById("timeLeftShift1").innerHTML = `(${currentLessonShift1.timeLeft} min left)`;
    } else {
        document.getElementById("lessonShift1").innerHTML = "-"; // если урока нет
        document.getElementById("timeLeftShift1").innerHTML = ""; // если урока нет, не показываем время
    }

    // Обновляем информацию для 2-й смены
    document.getElementById("currentLessonShift2").innerHTML = `2nd shift`;
    if (currentLessonShift2.lessonName) {
        document.getElementById("lessonShift2").innerHTML = `${currentLessonShift2.lessonName}`;
        document.getElementById("timeLeftShift2").innerHTML = `(${currentLessonShift2.timeLeft} min left)`;
    } else {
        document.getElementById("lessonShift2").innerHTML = "-"; // если урока нет
        document.getElementById("timeLeftShift2").innerHTML = ""; // если урока нет, не показываем время
    }

    document.getElementById("currentTime").innerHTML = `Current time(s): ${getCurrentTimeInSeconds()}`;
};

// Обновляем уроки сразу после загрузки страницы
updateCurrentLessons();

// Обновляем данные каждую секунду (1000 миллисекунд)
setInterval(updateCurrentLessons, 1000);


AOS.init({
    duration: 400,  // Ускоряет анимацию (значение в миллисекундах)
    once: true       // Анимация срабатывает только один раз
    
});

