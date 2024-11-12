// app/components/WeatherAndTime.js
'use client';

import { useEffect, useState } from 'react';
import { fetchWeather } from './weatherActions';

const WeatherAndTime = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [localTime, setLocalTime] = useState('');

    // Получаем погоду
    useEffect(() => {
        async function getWeather() {
            const data = await fetchWeather();
            if (data.error) {
                setError(data.error);
            } else {
                setWeatherData(data);
            }
        }

        getWeather();

        // Обновляем время каждую секунду
        const timer = setInterval(() => {
            const now = new Date();
            setLocalTime(now.toLocaleTimeString());
        }, 1000);

        // Очищаем таймер при размонтировании
        return () => clearInterval(timer);
    }, []);

    // Функция для обновления иконки погоды
    // @ts-ignore
    const updateWeatherIcon = (weather) => {
        const mainWeather = weather.current.condition.text;
        const description = weather.current.condition.text;
        let icon = '';

        if (mainWeather.includes('snow')) {
            icon = '❄️';
        } else if (mainWeather.includes('rain') || mainWeather.includes('drizzle')) {
            icon = '🌧️';
        } else if (mainWeather.includes('thunderstorm')) {
            icon = '⛈️';
        } else if (mainWeather.includes('cloud')) {
            icon = '☁️';
        } else if (mainWeather.includes('clear')) {
            icon = '☀️';
        } else if (mainWeather.includes('mist') || mainWeather.includes('fog')) {
            icon = '🌫️';
        } else {
            icon = '🌈';
        }

        return `${icon} ${description}`;
    };

    return (
        <section id="overview" className="section !w-full transition-all !mx-0">
            <h2>Weather and Time</h2>
            <div className="name-weather">
                <div id="weather-icon" className="weather-icon">
                    {weatherData ? updateWeatherIcon(weatherData) : '🔃'}
                </div>
                <div id="local-time" className="local-time">

                </div>
            </div>
            {error && <div className="error">{error}</div>}
        </section>
    );
};

export default WeatherAndTime;
