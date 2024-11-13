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

let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
        const h1h2Elements = document.querySelectorAll('h1, h2'); // Получаем все заголовки h1 и h2
        const avtextElement = document.querySelector('.avtext'); // Ваш никнейм

        if (scrollY > 25 * 16) { // scrollY > 400px, эквивалентно 25rem
            document.body.style.backgroundColor = '#02090e';
            document.body.style.color = '#4f99c1';
        
            images.forEach((img) => {
                if (img !== avatar && !socialIcons.includes(img)) {
                    img.style.opacity = '0';
                }
            });
        
            h1h2Elements.forEach((el) => {
                el.style.color = '#1a4b8e';
            });
        
            if (avtextElement) {
                avtextElement.style.color = '#1a4b8e';
            }
        } else {
            document.body.style.backgroundColor = '#000000';
            document.body.style.color = '#b9b4b4';
        
            images.forEach((img) => {
                if (img !== avatar && !socialIcons.includes(img)) {
                    img.style.opacity = '1';
                }
            });
        
            h1h2Elements.forEach((el) => {
                el.style.color = '#78b89a';
            });
        
            if (avtextElement) {
                avtextElement.style.color = '#78b89a';
            }
        }
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
    threshold: 0.5 // Эффект запускается, если видео видно на 50%
});

// Наблюдаем за видео
observer.observe(video);

// Функция для плавного увеличения громкости
function fadeInVolume(videoElement) {
    if (isFading) return;
    isFading = true;
    const fadeInInterval = setInterval(() => {
        if (videoElement.volume < 0.8) {
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
        if (videoElement.volume > 0.2) {
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
            {lesson: "Классный час", start: 29700, end: 30600},
            {lesson: "1 урок", start: 30900, end: 34100},
            {lesson: "2 урок", start: 35400, end: 37800},
            {lesson: "3 урок", start: 38700, end: 41100},
            {lesson: "4 урок", start: 41400, end: 43000},
            {lesson: "5 урок", start: 43600, end: 46800},
            {lesson: "6 урок", start: 48000, end: 50400},
            {lesson: "7 урок", start: 50700, end: 53100}
        ],
        shift2: [
            {lesson: "0 урок", start: 43600, end: 46800},
            {lesson: "1 урок", start: 48000, end: 50400},
            {lesson: "2 урок", start: 50700, end: 53100},
            {lesson: "3 урок", start: 54600, end: 57000},
            {lesson: "Классный час", start: 57700, end: 58900},
            {lesson: "4 урок", start: 60000, end: 62400},
            {lesson: "5 урок", start: 63000, end: 65400},
            {lesson: "6 урок", start: 65800, end: 68400}
        ]
    },
    2: {
        shift1: [
            {lesson: "1 урок", start: 29700, end: 32100},
            {lesson: "2 урок", start: 32400, end: 34800},
            {lesson: "3 урок", start: 36000, end: 38400},
            {lesson: "4 урок", start: 39600, end: 42000},
            {lesson: "5 урок", start: 42000, end: 43200},
            {lesson: "6 урок", start: 43800, end: 46200},
            {lesson: "7 урок", start: 47400, end: 49800}
        ],
        shift2: [
            {lesson: "0 урок", start: 42000, end: 43200},
            {lesson: "1 урок", start: 43800, end: 46200},
            {lesson: "2 урок", start: 47400, end: 49800},
            {lesson: "3 урок", start: 53100, end: 55500},
            {lesson: "4 урок", start: 56400, end: 57600},
            {lesson: "5 урок", start: 59400, end: 61800},
            {lesson: "6 урок", start: 62400, end: 64800},
        ]
    },
    3: {
        shift1: [
            {lesson: "1 урок", start: 29700, end: 32100},
            {lesson: "2 урок", start: 32400, end: 34800},
            {lesson: "3 урок", start: 36000, end: 38400},
            {lesson: "Классный час", start: 38100, end: 38700},
            {lesson: "4 урок", start: 39000, end: 41400},
            {lesson: "5 урок", start: 43600, end: 46800},
            {lesson: "6 урок", start: 48000, end: 50400},
            {lesson: "7 урок", start: 50700, end: 53100}
        ],
        shift2: [
            {lesson: "0 урок", start: 43600, end: 46800},
            {lesson: "1 урок", start: 48000, end: 50400},
            {lesson: "2 урок", start: 50700, end: 53100},
            {lesson: "3 урок", start: 54600, end: 57000},
            {lesson: "Классный час", start: 57700, end: 58900},
            {lesson: "4 урок", start: 60000, end: 62400},
            {lesson: "5 урок", start: 63000, end: 65400},
            {lesson: "6 урок", start: 65800, end: 68400}
        ]
    },
    4: {
        shift1: [
            {lesson: "1 урок", start: 29700, end: 32100},
            {lesson: "2 урок", start: 32400, end: 34800},
            {lesson: "3 урок", start: 36000, end: 38400},
            {lesson: "Классный час", start: 38100, end: 38700},
            {lesson: "4 урок", start: 39000, end: 41400},
            {lesson: "5 урок", start: 43600, end: 46800},
            {lesson: "6 урок", start: 48000, end: 50400},
            {lesson: "7 урок", start: 50700, end: 53100}
        ],
        shift2: [
            {lesson: "0 урок", start: 43600, end: 46800},
            {lesson: "1 урок", start: 48000, end: 50400},
            {lesson: "2 урок", start: 50700, end: 53100},
            {lesson: "3 урок", start: 54600, end: 57000},
            {lesson: "Классный час", start: 57700, end: 58900},
            {lesson: "4 урок", start: 60000, end: 62400},
            {lesson: "5 урок", start: 63000, end: 65400},
            {lesson: "6 урок", start: 65800, end: 68400}
        ]
    },
    5: {
        shift1: [
            {lesson: "1 урок", start: 29700, end: 32100},
            {lesson: "2 урок", start: 32400, end: 34800},
            {lesson: "3 урок", start: 36000, end: 38400},
            {lesson: "4 урок", start: 39600, end: 42000},
            {lesson: "5 урок", start: 42000, end: 43200},
            {lesson: "6 урок", start: 43800, end: 46200},
            {lesson: "7 урок", start: 47400, end: 49800}
        ],
        shift2: [
            {lesson: "0 урок", start: 42000, end: 43200},
            {lesson: "1 урок", start: 43800, end: 46200},
            {lesson: "2 урок", start: 47400, end: 49800},
            {lesson: "3 урок", start: 53100, end: 55500},
            {lesson: "4 урок", start: 56400, end: 57600},
            {lesson: "5 урок", start: 59400, end: 61800},
            {lesson: "6 урок", start: 62400, end: 64800},
        ]
    }
};
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
        if (currentTime >= lesson.start && currentTime < lesson.end) {
            return lesson.lesson; // возвращаем текущий урок
        }
    }

    return "-"; // если урока нет в этот момент
};

// Функция для обновления текущих уроков
const updateCurrentLessons = () => {
    // Определяем текущий урок для смены shift1 и shift2
    const currentLessonShift1 = getCurrentLesson('shift1');
    const currentLessonShift2 = getCurrentLesson('shift2');

    // Выводим результат на страницу
    document.getElementById("currentLessonShift1").innerHTML = `1st shift: ${currentLessonShift1}`;
    document.getElementById("currentLessonShift2").innerHTML = `2nd shift: ${currentLessonShift2}`;
    document.getElementById("currentTime").innerHTML = `Current time(s): ${getCurrentTimeInSeconds()}`;
};

// Обновляем уроки сразу после загрузки страницы
updateCurrentLessons();

// Обновляем данные каждую секунду (1000 миллисекунд)
setInterval(updateCurrentLessons, 1000);  // обновление каждую секунду
