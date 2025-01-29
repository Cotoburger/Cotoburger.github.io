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