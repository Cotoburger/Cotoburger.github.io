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

const lastUpdateElement = document.getElementById("last-update");
const lastDeploymentElement = document.getElementById("last-deployment");

if (lastUpdateElement) {
    lastUpdateElement.textContent = "Загрузка информации о последнем коммите...";
}
if (lastDeploymentElement) {
    lastDeploymentElement.textContent = "Загрузка информации о последнем деплое...";
}

// Получаем дату последнего коммита
fetch("https://api.github.com/repos/Cotoburger/Cotoburger.github.io")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (lastUpdateElement) {
            const date = new Date(data.pushed_at);
            const formattedDate = date.toLocaleDateString("ru-RU");
            const formattedTime = date.toLocaleTimeString("ru-RU");

            lastUpdateElement.textContent = `Последний коммит: ${formattedDate} ${formattedTime}`;
            console.log("Last commit: " + formattedDate + " " + formattedTime);
        }
    })
    .catch(error => {
        console.error("Ошибка:", error);
        if (lastUpdateElement) {
            lastUpdateElement.textContent = "Не удалось получить информацию о последнем коммите";
        }
    });

// Получаем информацию о последнем деплое
fetch("https://api.github.com/repos/Cotoburger/Cotoburger.github.io/deployments", {
    headers: {
        "Accept": "application/vnd.github.v3+json"
    }
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

        // Получаем статус деплоя
        return fetch(latestDeployment.statuses_url, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        }).then(statusResponse => {
            if (!statusResponse.ok) {
                throw new Error(`Ошибка HTTP! Статус: ${statusResponse.status}`);
            }
            return statusResponse.json();
        }).then(statuses => {
            const latestStatus = statuses[0] || { state: "unknown" }; // Берём последний статус
            const statusText = latestStatus.state === "success" ? "✅" :
                latestStatus.state === "failure" ? "❌ Ошибка" :
                latestStatus.state === "pending" ? "⏳ В процессе" : "❔ Неизвестно";

            if (lastDeploymentElement) {
                lastDeploymentElement.textContent = `Последний деплой: ${formattedDate} ${formattedTime} (${statusText})`;
                console.log("Last deployment: " + formattedDate + " " + formattedTime + " (" + latestStatus.state + ")");
            }
        });
    })
    .catch(error => {
        console.error("Ошибка:", error);
        if (lastDeploymentElement) {
            lastDeploymentElement.textContent = "Не удалось получить информацию о последнем деплое";
        }
    });

    const proxyList = [
        "https://corsproxy.io/?",
        "https://api.allorigins.win/raw?url=",
        "https://thingproxy.freeboard.io/fetch/",
        "https://cors-anywhere.herokuapp.com/"
    ];
    
    // Функция выбора случайного прокси
    function getRandomProxy() {
        return proxyList[Math.floor(Math.random() * proxyList.length)];
    }
    
    // Делаем запрос через случайный прокси
    function fetchWithRandomProxy(url) {
        const proxy = getRandomProxy();
        console.log(`Используем прокси: ${proxy}`);
    
        fetch(proxy + encodeURIComponent(url))
            .then(response => response.json())
            .then(data => console.log("Данные:", data))
            .catch(error => console.error("Ошибка запроса:", error));
    }
    
