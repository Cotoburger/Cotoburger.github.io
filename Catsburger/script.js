// Находим все изображения на странице и аватарку
const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');

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

// Отслеживание события прокрутки с оптимизацией
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
        const h1h2Elements = document.querySelectorAll('h1, h2'); // Получаем все заголовки h1 и h2
        if (scrollY > 350) {
            // Тёмная тема
            document.body.style.backgroundColor = '#90a4bf';
            document.body.style.color = '#000000';

            images.forEach((img) => {
                if (img !== avatar) {
                    img.style.opacity = '0'; // Пропускаем аватарку
                }
            });

            // Меняем цвет для h1 и h2
            h1h2Elements.forEach((el) => {
                el.style.color = '#1a4b8e'; // Цвет заголовков в темной теме
            });

        } else {
            // Светлая тема
            document.body.style.backgroundColor = '#000000';
            document.body.style.color = '#b9b4b4';

            images.forEach((img) => {
                if (img !== avatar) {
                    img.style.opacity = '1'; // Восстанавливаем изображения
                }
            });

            // Меняем цвет для h1 и h2 на синий
            h1h2Elements.forEach((el) => {
                el.style.color = '#78b89a'; // Цвет заголовков в светлой теме
            });
        }
    });
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
