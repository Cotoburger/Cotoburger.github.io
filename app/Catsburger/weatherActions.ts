"use server"

export async function fetchWeather() {
    try {
        const city = '53.033980, 158.669447';
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=` + city + "&lang=en");
        if (!response.ok) {
            throw new Error('Не удалось получить данные о погоде');
        }
        return await response.json()
    } catch (error) {
        // @ts-expect-error
        return { error: error.message };
    }
}
