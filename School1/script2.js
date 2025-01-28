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
    const links = toolsPanel.querySelectorAll('a');

    menuIcon.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        toolsPanel.classList.toggle("active");

        if (navigator.vibrate) {
            navigator.vibrate([5]);
        }
    });

    links.forEach(link => {
        link.addEventListener("click", (event) => {
            if (navigator.vibrate) {
                navigator.vibrate(5);
            }
        });
    });

    document.addEventListener("mousedown", (event) => {
        if (!toolsPanel.contains(event.target) && !menuIcon.contains(event.target)) {
            toolsPanel.classList.remove("active");
        }
    });
    
    const themeToggle = document.getElementById("themeToggle");
    themeToggle.addEventListener("click", () => {

        if (navigator.vibrate) {
            navigator.vibrate(5);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const snowflakesContainer = document.getElementById("snowflakes");
    const maxSnowflakes = 45;

    function createSnowflake() {
        if (snowflakesContainer.children.length >= maxSnowflakes) {
            return;
        }

        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");

        const size = Math.random() * 19 + 5;
        const leftPosition = Math.random() * 96;
        const animationDuration = Math.random() * 15 + 5;

        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${leftPosition}%`;
        snowflake.style.animationDuration = `${animationDuration}s`;

        const rotation = Math.random() * 360;
        snowflake.style.transform = `rotate(${rotation}deg)`;

        snowflakesContainer.appendChild(snowflake);

        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
        });
    }

    function snowflakesLoop() {
        createSnowflake();
        setTimeout(() => {
            requestAnimationFrame(snowflakesLoop);
        }, 300);
    }

    snowflakesLoop();
});

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");

    document.body.style.transition = "background-color 0.3s, color 0.3s";
    themeToggle.style.transition = "transform 0.4s ease-in-out, opacity 0.2s ease-in-out";
    document.documentElement.style.transition = "background-color 0.3s";

    themeToggle.style.opacity = "0";
    themeToggle.style.transform = "rotate(180deg)";

    function setTheme(theme) {
        if (theme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
            document.documentElement.style.backgroundColor = "#ffffff";
            themeToggle.style.backgroundImage = "url('images/sun.svg')";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            document.documentElement.style.backgroundColor = "#0e1213";
            themeToggle.style.backgroundImage = "url('images/moon.svg')";
        }
    }

    const savedTheme = localStorage.getItem("theme") || 
                      (window.matchMedia('(prefers-color-scheme: light)').matches ? "light" : "dark");
    setTheme(savedTheme);

    requestAnimationFrame(() => {
        themeToggle.style.opacity = "1";
        themeToggle.style.transform = "rotate(0deg)";
    });

    themeToggle.addEventListener("click", () => {
        themeToggle.style.transform = "rotate(180deg)";
        themeToggle.style.opacity = "0";
        
        setTimeout(() => {
            const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
            
            themeToggle.style.opacity = "1";
            themeToggle.style.transform = "rotate(0deg)";
        }, 200);
    });
});






let isVibrationEnabled = true; // Флаг для включения/выключения вибрации

// Проверка, поддерживает ли браузер вибрацию
function checkVibrationSupport() {
    if (navigator.vibrate === undefined) {
        console.log('Vibration is not supported by this browser.');
        isVibrationEnabled = false; // Отключаем вибрацию, если она не поддерживается
        document.getElementById('vibrationToggle').disabled = true; // Отключаем тумблер
    } else {
        console.log('Vibration is supported by this browser.');
    }
}

// Загружаем настройки вибрации из localStorage при старте страницы
function loadVibrationSettings() {
    const savedSetting = localStorage.getItem('vibrationEnabled');
    if (savedSetting !== null) {
        isVibrationEnabled = savedSetting === 'true'; // Преобразуем строку 'true' или 'false' обратно в boolean
    }
    document.getElementById('vibrationToggle').checked = isVibrationEnabled; // Обновляем состояние тумблера
}

// Проверка разрешений на вибрацию
function checkVibrationPermission() {
    if (navigator.permissions) {
        navigator.permissions.query({ name: 'vibrate' }).then(function(permissionStatus) {
            if (permissionStatus.state === 'granted') {
                console.log('Vibration permission granted');
            } else if (permissionStatus.state === 'denied') {
                console.log('Vibration permission denied');
                isVibrationEnabled = false; // Если доступ запрещен, выключаем вибрацию
            } else {
                console.log('Vibration permission prompt required');
                isVibrationEnabled = true; // Вибрация разрешена по умолчанию
            }
        });
    } else {
        console.log('Permissions API not supported');
        // Если API разрешений не поддерживается, можно считать, что вибрация включена
        isVibrationEnabled = true;
    }
}

// Функция для включения/выключения вибрации
function toggleVibration() {
    isVibrationEnabled = document.getElementById('vibrationToggle').checked;
    localStorage.setItem('vibrationEnabled', isVibrationEnabled); // Сохраняем настройку в localStorage
    console.log('Vibration enabled:', isVibrationEnabled);
}
// Функция для активации вибрации
function vibratePhone() {
    if (navigator.vibrate) {
        navigator.vibrate(200); // Вибрация на 200 миллисекунд
    } else {
        console.log('Vibration is not supported by this browser.');
    }
}

// Проверка разрешений на вибрацию при загрузке страницы
checkVibrationPermission();
// Загрузка настроек вибрации из localStorage
loadVibrationSettings();