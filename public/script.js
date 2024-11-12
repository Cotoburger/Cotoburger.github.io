// Находим все изображения на странице и аватарку, а также изображения соцсетей
const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');
const socialIcons = document.querySelectorAll('.social-icon'); // Изображения соцсетей

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

const weatherIcon = document.getElementById('weather-icon');

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
