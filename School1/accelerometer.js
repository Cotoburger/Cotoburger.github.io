let lastUpdate = 0;
let lastVibration = 0;
let vibrationDelay = 500; // Задержка между вибрациями (мс)
let x = y = z = lastX = lastY = lastZ = 0;
let isPopupVisible = false; // Флаг для проверки активности окна

function handleDeviceMotion(event) {
    const acceleration = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
    const currentTime = new Date().getTime();

    // Проверяем данные каждые 150 мс
    if ((currentTime - lastUpdate) > 150) {
        const timeDifference = (currentTime - lastUpdate) / 1000;
        lastUpdate = currentTime;

        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);

        // Фильтруем малые изменения
        if (deltaX < 0.4 && deltaY < 0.4) {
            return;
        }

        // Рассчитываем скорость
        const speed = (Math.abs(x - lastX) + Math.abs(y - lastY)) / timeDifference;

        // Проверяем скорость и задержку между вибрациями
        if (speed > 400 && (currentTime - lastVibration) > vibrationDelay && !isPopupVisible) {
            showPopup(); // Показываем окно при тряске
            lastVibration = currentTime;
            console.log('Device shaken! Speed:', speed);
        }

        lastX = x;
        lastY = y;
        lastZ = z;
    }
}

function showPopup() {
    if (isPopupVisible) return; // Если окно уже показывается, не запускаем заново

    isPopupVisible = true; // Устанавливаем флаг активности окна

    const popup = document.getElementById('vibrationPopup');
    
    // Убираем начальные стили
    popup.style.display = 'block';
    popup.style.opacity = '0'; // Сначала окно полностью прозрачно
    popup.style.transition = 'opacity 0.5s ease'; // Плавный переход для opacity
    popup.classList.add('shake2'); // Добавляем анимацию тряски

    // Плавно увеличиваем прозрачность окна
    setTimeout(() => {
        popup.style.opacity = '1'; // Делаем окно видимым
    }, 50); // Маленькая задержка, чтобы плавно начало проявляться

    // Убираем класс анимации после завершения
    setTimeout(() => {
        popup.classList.remove('shake2');
    }, 500); // Длительность анимации тряски

    // Проверяем направление движения при поднятии/опускании телефона
    monitorPopupMotion();

    // Плавно скрываем окно через 4.5 секунды
    setTimeout(() => {
        popup.style.opacity = '0'; // Начинаем скрывать окно
    }, 4500); // Начинаем скрывать через 4.5 секунды после показа

    // Полностью скрываем окно через 5 секунд и сбрасываем флаг активности
    setTimeout(() => {
        popup.style.display = 'none';
        isPopupVisible = false; // Сбрасываем флаг, чтобы разрешить активацию окна снова
    }, 5000); // Окончательное скрытие через 5 секунд
}

function monitorPopupMotion() {
    const motionListener = (event) => {
        const acceleration = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
        const z = acceleration.z;

        console.log('Z-axis acceleration:', z); // Логируем значение оси Z

        // Проверяем направление движения
        if (z > 5) { // Телефон поднимается вверх
            console.log('Phone moved up');
            window.location.href = 'https://example.com/page-up';
        } else if (z < -5) { // Телефон опускается вниз
            console.log('Phone moved down');
            window.location.href = 'https://example.com/page-down';
        }
    };

    window.addEventListener('devicemotion', motionListener);

    // Убираем слушатель после закрытия попапа
    setTimeout(() => {
        window.removeEventListener('devicemotion', motionListener);
        console.log('Motion listener removed');
    }, 5000); // Длительность проверки совпадает с показом попапа
}

window.addEventListener('devicemotion', handleDeviceMotion);





