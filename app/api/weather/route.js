export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
    try {
        const city = '53.033980, 158.669447';
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=en`);

        if (!response.ok) {
            throw new Error('Unable to fetch weather data');
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        // @ts-expect-error
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
