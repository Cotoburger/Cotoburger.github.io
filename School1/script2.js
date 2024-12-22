const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');
const socialIcons = document.querySelectorAll('.social-icon');


function pxToRem(px) {
    return px / 16 + 'rem';
}


AOS.init({
    duration: 200,
    once: true
    
}); 

document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menuIcon");
    const toolsPanel = document.getElementById("toolsPanel");
    const links = toolsPanel.querySelectorAll('a'); // Получаем все ссылки внутри панели

    menuIcon.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        toolsPanel.classList.toggle("active");

        // Имитация интенсивной вибрации при открытии панели
        if (navigator.vibrate) {
            navigator.vibrate([10]);  // Вибрация 50ms, пауза 20ms, снова 50ms, и так далее
        }
    });

    // Добавляем обработчик нажатия на каждую ссылку
    links.forEach(link => {
        link.addEventListener("click", (event) => {
            // Вибрация при клике на ссылку
            if (navigator.vibrate) {
                navigator.vibrate(10); // Вибрация длительностью 50 миллисекунд
            }
        });
    });

    document.addEventListener("mousedown", (event) => {
        if (!toolsPanel.contains(event.target) && !menuIcon.contains(event.target)) {
            toolsPanel.classList.remove("active");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const snowflakesContainer = document.getElementById("snowflakes");
    const maxSnowflakes = 45; // Максимальное количество снежинок на экране

    function createSnowflake() {
        if (snowflakesContainer.children.length >= maxSnowflakes) {
            return;
        }

        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");

        // Задаем случайные параметры для снежинок
        const size = Math.random() * 19 + 5; // Размер снежинки
        const leftPosition = Math.random() * 97; // Позиция по горизонтали
        const animationDuration = Math.random() * 15 + 5; // Длительность падения

        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${leftPosition}%`;
        snowflake.style.animationDuration = `${animationDuration}s`;

        // Генерация случайных углов наклона для снежинок
        const rotation = Math.random() * 360;
        snowflake.style.transform = `rotate(${rotation}deg)`;

        snowflakesContainer.appendChild(snowflake);

        // Удаление снежинки после завершения анимации
        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
        });
    }

    function snowflakesLoop() {
        createSnowflake();
        setTimeout(() => {
            requestAnimationFrame(snowflakesLoop);
        }, 300); // Увеличенный интервал между созданием снежинок
    }

    // Запуск анимации снежинок
    snowflakesLoop();
});

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");

    // Добавляем плавный переход для изменения темы и иконки
    document.body.style.transition = "background-color 0.5s, color 0.5s";
    themeToggle.style.transition = "transform 0.3s, opacity 0.3s";
    document.documentElement.style.transition = "background-color 0.5s";

    // Функция для установки темы
    function setTheme(theme) {
        themeToggle.style.opacity = "0"; // Начинаем исчезновение иконки
        setTimeout(() => {
            if (theme === "light") {
                document.documentElement.setAttribute("data-theme", "light");
                document.documentElement.style.backgroundColor = "#ffffff"; // Меняем фон для html
                themeToggle.style.backgroundImage = "url('images/sun.svg')";
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
                document.documentElement.style.backgroundColor = "#0e1213"; // Устанавливаем темный фон
                themeToggle.style.backgroundImage = "url('images/moon.svg')";
            }
            themeToggle.style.transform = "rotate(360deg)";
            themeToggle.style.opacity = "1"; // Плавное появление новой иконки
            setTimeout(() => {
                themeToggle.style.transform = "rotate(0deg)";
            }, 500);
        }, 500);
    }

    // Проверяем, есть ли сохраненная тема в localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Устанавливаем начальную тему на основе предпочтений пользователя
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    }

    // Обработчик клика для переключения темы
    themeToggle.addEventListener("click", () => {
        if (document.documentElement.getAttribute("data-theme") === "light") {
            setTheme("dark");
            localStorage.setItem("theme", "dark");
        } else {
            setTheme("light");
            localStorage.setItem("theme", "light");
        }
    });
});