// Находим все изображения на странице и аватарку, а также изображения соцсетей
const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');
const socialIcons = document.querySelectorAll('.social-icon'); // Изображения соцсетей

// Инициализация Swiper
const swiper = new Swiper('.swiper-container', {
    spaceBetween: 20,
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
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
        const h1h2Elements = document.querySelectorAll('h1, h2'); // Получаем все заголовки h1 и h2
        const avtextElement = document.querySelector('.avtext'); // Ваш никнейм

        if (scrollY > 400) {
            // Тёмная тема
            document.body.style.backgroundColor = '#02090e'; // САМОЕ ВАЖНОЕ
            document.body.style.color = '#4f99c1'; // ЦВЕТ ТЕКСТА

            images.forEach((img) => {
                if (img !== avatar && !socialIcons.includes(img)) { // Исключаем иконки соцсетей
                    img.style.opacity = '0'; // Пропускаем аватарку и изображения соцсетей
                }
            });

            // Меняем цвет для h1, h2 и никнейма
            h1h2Elements.forEach((el) => {
                el.style.color = '#1a4b8e'; // Цвет заголовков в темной теме
            });

            if (avtextElement) {
                avtextElement.style.color = '#1a4b8e'; // Меняем цвет никнейма в темной теме
            }

        } else {
            // Светлая тема
            document.body.style.backgroundColor = '#000000';
            document.body.style.color = '#b9b4b4';

            images.forEach((img) => {
                if (img !== avatar && !socialIcons.includes(img)) { // Исключаем иконки соцсетей
                    img.style.opacity = '1'; // Восстанавливаем изображения
                }
            });

            // Меняем цвет для h1, h2 и никнейма на светлый
            h1h2Elements.forEach((el) => {
                el.style.color = '#78b89a'; // Цвет заголовков в светлой теме
            });

            if (avtextElement) {
                avtextElement.style.color = '#78b89a'; // Меняем цвет никнейма в светлой теме
            }
        }
    });
});

// Видео и аудио
const video = document.getElementById('background-video');
const audio = new Audio('images/Josh Hutcherson __ Whistle.mp3'); // Загружаем аудио-файл отдельно

// Устанавливаем начальную громкость аудио
audio.volume = 0;

// Видео запускается автоматически, но без звука (muted)
video.muted = true;

// Создаем Intersection Observer для аудио
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            audio.play().catch((error) => console.log("Аудио не запустилось автоматически:", error));
            fadeInVolume(audio); // Увеличиваем громкость аудио
        } else {
            fadeOutVolume(audio); // Уменьшаем громкость аудио
        }
    });
}, {
    threshold: 0.5
});

observer.observe(audio);

// Функция для плавного увеличения громкости
function fadeInVolume(audioElement) {
    const fadeInInterval = setInterval(() => {
        if (audioElement.volume < 1) {
            audioElement.volume = Math.min(audioElement.volume + 0.05, 1);
        } else {
            clearInterval(fadeInInterval);
        }
    }, 30);
}

// Функция для плавного уменьшения громкости
function fadeOutVolume(audioElement) {
    const fadeOutInterval = setInterval(() => {
        if (audioElement.volume > 0) {
            audioElement.volume = Math.max(audioElement.volume - 0.05, 0);
        } else {
            audioElement.pause(); // Останавливаем аудио, когда громкость достигает 0
            clearInterval(fadeOutInterval);
        }
    }, 30);
}

// Кнопка для включения/выключения звука
const muteButton = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');

// Иконки для включенного и выключенного звука
const soundOnIcon = 'images/sound-on.svg';
const soundOffIcon = 'images/sound-off.svg';

// Обработчик клика на кнопку для включения/выключения звука видео
muteButton.addEventListener('click', () => {
    if (video.muted) {
        video.muted = false; // Включаем звук видео
        muteIcon.src = soundOnIcon; // Меняем иконку на включенный звук
    } else {
        video.muted = true; // Выключаем звук видео
        muteIcon.src = soundOffIcon; // Меняем иконку на выключенный звук
    }
});

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

