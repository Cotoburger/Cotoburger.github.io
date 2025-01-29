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

// URL репозитория GitHub
const repoUrl = 'https://api.github.com/repos/Cotoburger/Cotoburger.github.io';
fetch(`${repoUrl}?t=${Date.now()}`, { cache: "no-store" })
// Функция для получения даты последнего изменения из кэша
function getCachedLastModified() {
    return localStorage.getItem('lastModified');
}

// Функция для сохранения даты последнего изменения в кэш
function saveCachedLastModified(lastModified) {
    localStorage.setItem('lastModified', lastModified);
}

// Функция для сравнения дат
function compareDates(serverDate, cachedDate) {
    if (!cachedDate) {
        console.log("Кэш пуст, данные будут загружены с сервера.");
        return false;
    }

    const serverTime = new Date(serverDate).getTime();
    const cachedTime = new Date(cachedDate).getTime();

    if (serverTime === cachedTime) {
        console.log("Файлы одинаковые (даты совпадают).");
        return true;
    } else {
        console.log("Файлы разные (даты не совпадают).");
        return false;
    }
}

// Функция для форматирования даты и времени
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Основной запрос к серверу
function fetchLastCommitInfo() {
    fetch(repoUrl, {
        method: 'HEAD' // Используем HEAD, чтобы получить только заголовки
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Получаем дату последнего изменения с сервера
            const serverLastModified = response.headers.get('Last-Modified');

            // Получаем дату последнего изменения из кэша
            const cachedLastModified = getCachedLastModified();

            // Сравниваем даты
            const isUpToDate = compareDates(serverLastModified, cachedLastModified);

            if (!isUpToDate) {
                // Если файл изменился, делаем полный запрос и обновляем кэш
                fetch(repoUrl)
                    .then(response => response.json())
                    .then(data => {
                        // Форматируем дату и время
                        const formattedDateTime = formatDateTime(data.pushed_at);

                        // Обновляем содержимое элемента на странице
                        const lastUpdateElement = document.getElementById("last-update");
                        if (lastUpdateElement) {
                            lastUpdateElement.textContent = `Последний коммит: ${formattedDateTime}`;
                            console.log("last update: " + formattedDateTime);
                        } else {
                            console.error("Element with id 'last-update' not found");
                        }

                        // Сохраняем новую дату в кэш
                        saveCachedLastModified(serverLastModified);
                    })
                    .catch(error => console.error("Ошибка при загрузке данных:", error));
            } else {
                // Если файл не изменился, используем данные из кэша
                const lastUpdateElement = document.getElementById("last-update");
                if (lastUpdateElement) {
                    const cachedDateTime = formatDateTime(cachedLastModified);
                    lastUpdateElement.textContent = `Последний коммит (из кэша): ${cachedDateTime}`;
                }
            }
        })
        .catch(error => {
            console.error("Ошибка при запросе заголовков:", error);
            const lastUpdateElement = document.getElementById("last-update");
            if (lastUpdateElement) {
                lastUpdateElement.textContent = "Не удалось получить информацию о последнем коммите";
            }
        });
}

// Вызываем функцию сразу при загрузке страницы
fetchLastCommitInfo();

// Устанавливаем интервал для обновления каждые 5 секунд
setInterval(fetchLastCommitInfo, 5000);
