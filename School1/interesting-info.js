// Функция для получения погоды
async function getWeather() {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Замените на ваш ключ API
    const city = 'Petropavlovsk-Kamchatsky';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const weatherInfo = `Температура: ${data.main.temp}°C, ${data.weather[0].description}`;
        document.getElementById('weather-data').textContent = weatherInfo;
    } catch (error) {
        console.error('Ошибка при получении погоды:', error);
        document.getElementById('weather-data').textContent = 'Не удалось загрузить погоду';
    }
}

// Функция для получения факта дня
async function getFact() {
    const url = 'https://uselessfacts.jsph.pl/random.json?language=ru';
    try {
        const response = await fetch(url);
        const data = await response.json();
        document.getElementById('fact-data').textContent = data.text;
    } catch (error) {
        console.error('Ошибка при получении факта:', error);
        document.getElementById('fact-data').textContent = 'Не удалось загрузить факт дня';
    }
}

// Загрузка всей информации
function loadInterestingInfo() {
    getWeather();
    getFact();
    getQuote();
}

// Загрузка информации при загрузке страницы
window.addEventListener('load', loadInterestingInfo);