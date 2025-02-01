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

// Функция для имитации тряски
function simulateShake() {
    const event = {
        accelerationIncludingGravity: {
            x: Math.random() * 500 - 1, // случайное значение для имитации
            y: Math.random() * 500 - 1,
            z: 0 // z оставим как 0
        }
    };

    handleDeviceMotion(event); // Вызываем обработчик как при реальной тряске
}

// Обновление данных каждую минуту (60000 миллисекунд)
// Функция для обновления данных
function updateData() {
    const lastUpdateElement = document.getElementById("last-update");
    const lastDeploymentElement = document.getElementById("last-deployment");
    
    // Получаем дату последнего коммита
    fetch("https://api.github.com/repos/Cotoburger/Cotoburger.github.io")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const date = new Date(data.pushed_at);
            const formattedDate = date.toLocaleDateString("ru-RU");
            const formattedTime = date.toLocaleTimeString("ru-RU");
            
            if (lastUpdateElement) {
                lastUpdateElement.textContent = `📤Last Commit: ${formattedDate} ${formattedTime}`;
            }
        })
        .catch(error => {
            console.error("Commit fetch failure:", error);
            if (lastUpdateElement) {
                lastUpdateElement.textContent = "❌ Commit fetch failure";
            }
        });
    
    // Получаем информацию о последнем деплое
    fetch("https://api.github.com/repos/Cotoburger/Cotoburger.github.io/deployments", {
        headers: { "Accept": "application/vnd.github.v3+json" }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                throw new Error("Нет доступных деплоев");
            }
            const latestDeployment = data[0]; // Берём самый свежий деплой
            const date = new Date(latestDeployment.created_at);
            const formattedDate = date.toLocaleDateString("ru-RU");
            const formattedTime = date.toLocaleTimeString("ru-RU");
            
            return fetch(latestDeployment.statuses_url, {
                headers: { "Accept": "application/vnd.github.v3+json" }
            }).then(statusResponse => {
                if (!statusResponse.ok) {
                    throw new Error(`Ошибка HTTP! Статус: ${statusResponse.status}`);
                }
                return statusResponse.json();
            }).then(statuses => {
                const latestStatus = statuses[0] || { state: "unknown" };
                const statusText = latestStatus.state === "success" ? "✅" :
                    latestStatus.state === "failure" ? "❌ ERROR" : "⏳ Deploy";
                
                if (lastDeploymentElement) {
                    lastDeploymentElement.textContent = `📦Last Deployment: ${formattedDate} ${formattedTime} (${statusText})`;
                }
            });
        })
        .catch(error => {
            console.error("Deployment fetch failure:", error);
            if (lastDeploymentElement) {
                lastDeploymentElement.textContent = "❌ Deployment fetch failure";
            }
        });
}

// Вызовем обновление данных при загрузке страницы
updateData();

// Обновление данных каждую минуту (60000 миллисекунд)
setInterval(updateData, 60000);


document.addEventListener("DOMContentLoaded", async function () {
    function updateInfo(id, text) {
        let elem = document.getElementById(id);
        if (elem) elem.textContent = text;
    }

    function logErrorToPage(message) {
        let errorElem = document.getElementById("error-log");
        if (errorElem) {
            let newError = document.createElement("p");
            newError.textContent = message;
            errorElem.appendChild(newError);
        }
    }

    // Перехват ошибок
    window.onerror = function (message, source, lineno, colno, error) {
        let errorText = `❌ Ошибка: ${message}`;
        if (source) errorText += `\n📍 Файл: ${source}`;
        if (lineno && colno) errorText += ` (строка ${lineno}, колонка ${colno})`;
        if (error && error.stack) errorText += `\n🛠 Стек:\n${error.stack}`;

        logErrorToPage(errorText);
    };

    console.error = function (...args) {
        logErrorToPage("❌ Ошибка: " + args.join(" "));
    };

    // Проверка вибрации
    if ("vibrate" in navigator) {
        updateInfo("vibration-status", "✅ API Вибрация");
    } else {
        updateInfo("vibration-status", "❌ API Вибрация");
    }

    // Проверка акселерометра
    if (window.DeviceMotionEvent) {
        updateInfo("accelerometer-status", "✅ API Акселерометр");
        window.addEventListener('devicemotion', function(event) {
            let acceleration = event.acceleration;
            let accelData = `
                x: ${acceleration.x ? acceleration.x.toFixed(2) : 'N/A'} m/s²,
                y: ${acceleration.y ? acceleration.y.toFixed(2) : 'N/A'} m/s²,
                z: ${acceleration.z ? acceleration.z.toFixed(2) : 'N/A'} m/s²
            `;
            updateInfo("accelerometer-data", accelData);
        });
    } else {
        updateInfo("accelerometer-status", "❌ API Акселерометр");
        updateInfo("accelerometer-data", "❌ Нет данных API Акселерометра");
    }

    // Проверка гироскопа
    if (window.DeviceOrientationEvent) {
        updateInfo("gyroscope-status", "✅ API Гироскоп");
        window.addEventListener('deviceorientation', function(event) {
            let gyroData = `
                alpha: ${event.alpha ? event.alpha.toFixed(2) : 'N/A'}°,
                beta: ${event.beta ? event.beta.toFixed(2) : 'N/A'}°,
                gamma: ${event.gamma ? event.gamma.toFixed(2) : 'N/A'}°
            `;
            updateInfo("gyroscope-data", gyroData);
        });
    } else {
        updateInfo("gyroscope-status", "❌ API Гироскоп");
        updateInfo("gyroscope-data", "❌ Нет данных API Гироскопа");
    }
    

    // Проверка разрешений
    if (navigator.permissions) {
        try {
            // Акселерометр
            let accelPermission = await navigator.permissions.query({ name: "accelerometer" }).catch(() => null);
            if (accelPermission) {
                updateInfo("accelerometer-permission", `Акселерометр: ${accelPermission.state}`);
            } else {
                updateInfo("accelerometer-permission", "Акселерометр: ???");
            }

            // Гироскоп
            let gyroPermission = await navigator.permissions.query({ name: "gyroscope" }).catch(() => null);
            if (gyroPermission) {
                updateInfo("gyroscope-permission", `Гироскоп: ${gyroPermission.state}`);
            } else {
                updateInfo("gyroscope-permission", "Гироскоп: ???");
            }

            // Вибрация (обычно не требует разрешения)
            let vibPermission = await navigator.permissions.query({ name: "vibration" }).catch(() => null);
            if (vibPermission) {
                updateInfo("vibration-permission", `Вибрация: ${vibPermission.state}`);
            } else {
                updateInfo("vibration-permission", "Вибрация: ???");
            }
        } catch (e) {
            console.error("Ошибка проверки разрешений:", e);
        }
    } else {
        updateInfo("vibration-permission", "❌ API разрешений не поддерживается");
        updateInfo("gyroscope-permission", "❌ API разрешений не поддерживается");
        updateInfo("accelerometer-permission", "❌ API разрешений не поддерживается");
    }
});

function logErrorToPage(message) {
    let errorElem = document.getElementById("error-log");
    if (errorElem) {
        let newError = document.createElement("p");
        newError.textContent = message;
        errorElem.appendChild(newError);
    }
}

// Перехват console.error и console.warn
let originalConsoleError = console.error;
let originalConsoleWarn = console.warn;

console.error = function (...args) {
    originalConsoleError.apply(console, args);
    logErrorToPage("❌ Ошибка: " + args.join(" "));
};

console.warn = function (...args) {
    originalConsoleWarn.apply(console, args);
    logErrorToPage("⚠️ Предупреждение: " + args.join(" "));
};

// Перехват window.onerror (ошибки на странице)
window.onerror = function (message, source, lineno, colno, error) {
    let errorText = `❌ Ошибка: ${message}`;
    if (source) errorText += `\n📍 Файл: ${source}`;
    if (lineno && colno) errorText += ` (строка ${lineno}, колонка ${colno})`;
    if (error && error.stack) errorText += `\n🛠 Стек:\n${error.stack}`;
    
    logErrorToPage(errorText);
};
