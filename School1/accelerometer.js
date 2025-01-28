if ('ondevicemotion' in window) {
    window.addEventListener('devicemotion', handleDeviceMotion);
} else {
    console.log('Device Motion API not supported on this device.');
}

let lastUpdate = 0;
let lastVibration = 0;
let vibrationDelay = 400; // Задержка между вибрациями (мс)
let x = y = z = lastX = lastY = lastZ = 0;
let isPopupVisible = false; // Флаг для проверки активности окна

function handleDeviceMotion(event) {
    const acceleration = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
    const currentTime = new Date().getTime();

    if ((currentTime - lastUpdate) > 275) {
        const timeDifference = (currentTime - lastUpdate) / 1000;
        lastUpdate = currentTime;

        x = acceleration.x;
        y = acceleration.y;

        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);

        if (deltaX < 0.2 && deltaY < 0.2) {
            return;
        }

        const speed = (Math.abs(x - lastX) + Math.abs(y - lastY)) / timeDifference;

        if (speed > 440 && (currentTime - lastVibration) > vibrationDelay && !isPopupVisible) {
            showPopup(); // Показываем окно при тряске
            lastVibration = currentTime;
            console.log('Device shaken! Speed:', speed);
        }

        lastX = x;
        lastY = y;
    }
}

function showPopup() {
    isPopupVisible = true; // Устанавливаем флаг активности окна

    const popup = document.getElementById('vibrationPopup');
    popup.style.display = 'block';
    popup.style.opacity = '1'; // Делаем окно полностью видимым

    // Добавляем класс с анимацией
    popup.classList.add('shake2');

    // Убираем класс анимации после завершения
    setTimeout(() => {
        popup.classList.remove('shake2');
    }, 500); // Длительность анимации

    // Плавно скрываем окно
    setTimeout(() => {
        popup.style.transition = 'opacity 0.5s ease'; // Добавляем плавный переход для прозрачности
        popup.style.opacity = '0'; // Скрываем окно плавно
    }, 4500); // Начинаем скрывать через 2.5 секунды

    // Полностью скрываем окно и сбрасываем флаг активности
    setTimeout(() => {
        popup.style.display = 'none';
        isPopupVisible = false; // Сбрасываем флаг, чтобы разрешить активацию окна снова
    }, 5000); // Окончательное скрытие через 5 секунд
}

window.addEventListener('devicemotion', handleDeviceMotion);









