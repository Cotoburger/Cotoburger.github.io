document.addEventListener("DOMContentLoaded", () => {
    const snowflakesContainer = document.getElementById("snowflakes");
    const maxSnowflakes = 45;
    const snowflakes = [];

    // Функция создания снежинки
    function createSnowflake() {
        if (snowflakes.length >= maxSnowflakes) return; // Ограничиваем максимальное количество снежинок

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
        snowflakes.push(snowflake); // Добавляем снежинку в массив

        // Удаляем снежинку после анимации
        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
            snowflakes.splice(snowflakes.indexOf(snowflake), 1); // Убираем снежинку из массива
        });
    }

    // Функция, которая будет вызываться регулярно для создания снежинок
    function snowflakesLoop() {
        createSnowflake();
        setTimeout(() => {
            requestAnimationFrame(snowflakesLoop); // Используем requestAnimationFrame для синхронизации с кадрами
        }, 300); // Пауза между созданием снежинок (можно настроить)
    }

    snowflakesLoop();
});