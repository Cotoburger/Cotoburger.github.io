document.addEventListener("DOMContentLoaded", () => {
    const snowflakesContainer = document.getElementById("snowflakes");
    const maxSnowflakes = 45;
    const snowflakes = [];

    // Получаем текущий месяц
    const currentMonth = new Date().getMonth() + 1; // Январь - 1, Декабрь - 12
    
    if (currentMonth === 12 || currentMonth === 2) {
        // Функция создания снежинки
        function createSnowflake() {
            if (snowflakes.length >= maxSnowflakes) return;

            const snowflake = document.createElement("div");
            snowflake.classList.add("snowflake");

            const size = Math.random() * 19 + 5;
            const leftPosition = Math.random() * 96;
            const animationDuration = Math.random() * 15 + 5;
            const rotation = Math.random() * 360;

            snowflake.style.width = `${size}px`;
            snowflake.style.height = `${size}px`;
            snowflake.style.left = `${leftPosition}%`;
            snowflake.style.animationDuration = `${animationDuration}s`;
            snowflake.style.transform = `rotate(${rotation}deg)`;

            snowflakesContainer.appendChild(snowflake);
            snowflakes.push(snowflake);

            snowflake.addEventListener('animationend', () => {
                snowflake.remove();
                snowflakes.splice(snowflakes.indexOf(snowflake), 1);
            });
        }

        // Функция запуска снежинок
        function snowflakesLoop() {
            createSnowflake();
            setTimeout(() => {
                requestAnimationFrame(snowflakesLoop);
            }, 300);
        }

        snowflakesLoop();
    }
});