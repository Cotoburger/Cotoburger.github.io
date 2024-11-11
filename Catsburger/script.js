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
        if (scrollY > 400) {
            // Тёмная тема
            document.body.style.backgroundColor = '#02090e'; // САМОЕ ВАЖНОЕ
            document.body.style.color = '#4f99c1'; // ЦВЕТ ТЕКСТА

            images.forEach((img) => {
                if (img !== avatar && !socialIcons.includes(img)) { // Исключаем иконки соцсетей
                    img.style.opacity = '0'; // Пропускаем аватарку и изображения соцсетей
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
                if (img !== avatar && !socialIcons.includes(img)) { // Исключаем иконки соцсетей
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

// Ваш API-ключ Steam (получите его на сайте Steam)
const steamApiKey = '3B52416F553AFD49DCCB3C9FBC4C3E2E';
const appId = 387990; // ID игры Scrap Mechanic

async function fetchLatestSteamUpdate() {
    const url = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appId}&count=1&maxlength=300&format=json&key=${steamApiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка запроса к Steam API');
        const data = await response.json();

        // Проверка на наличие новостей
        if (data && data.appnews && data.appnews.newsitems && data.appnews.newsitems.length > 0) {
            const latestUpdate = data.appnews.newsitems[0];
            const date = new Date(latestUpdate.date * 1000).toLocaleDateString(); // Преобразуем дату
            const title = latestUpdate.title;
            const content = latestUpdate.contents;

            // Отображение последнего изменения на странице
            const updatesList = document.getElementById('updates-list');
            updatesList.innerHTML = `<li><strong>${date}</strong>: <em>${title}</em> - ${content}</li>`;
        } else {
            document.getElementById('updates-list').textContent = 'Нет данных о последнем изменении.';
        }
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        document.getElementById('updates-list').textContent = 'Не удалось загрузить данные.';
    }
}

// Вызываем функцию для получения данных
fetchLatestSteamUpdate();