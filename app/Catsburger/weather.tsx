// app/components/WeatherAndTime.js
'use client';

import { useEffect, useState } from 'react';

const WeatherAndTime = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    // Получаем погоду
    useEffect(() => {
        async function getWeather() {
            try {
                const city = '53.033980, 158.669447';
                const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=c532a6657c064d5c8b2145117230101&q=${city}&lang=en`);
                if (!response.ok) {
                    throw new Error('Error fetching weather data');
                }

                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                } else {
                    setWeatherData(data);
                }
            } catch (error) {
                // @ts-expect-error
                setError(error.message);
            }
        }

        getWeather();
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