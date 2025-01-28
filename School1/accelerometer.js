if ('ondevicemotion' in window) {
    window.addEventListener('devicemotion', handleDeviceMotion);
} else {
    console.log('Device Motion API not supported on this device.');
}

let lastUpdate = 0;
let lastVibration = 0; // Последнее время вибрации
let vibrationDelay = 400; // Задержка между вибрациями (мс)
let x = y = z = lastX = lastY = lastZ = 0;

function handleDeviceMotion(event) {
    const acceleration = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
    const currentTime = new Date().getTime();

    // Проверяем каждые 150 мс
    if ((currentTime - lastUpdate) > 150) {
        const timeDifference = (currentTime - lastUpdate) / 1000;
        lastUpdate = currentTime;

        x = acceleration.x;
        y = acceleration.y;
        // Игнорируем вертикальное ускорение (ось Z)
        // z = acceleration.z; 

        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        // Вертикальная скорость (z) не учитывается
        // const deltaZ = Math.abs(z - lastZ);

        if (deltaX < 0.2 && deltaY < 0.2) {
            // Игнорируем малые изменения
            return;
        }

        // Рассчитываем скорость только по осям X и Y
        const speed = (Math.abs(x - lastX) + Math.abs(y - lastY)) / timeDifference;

        // Обновляем отображение скорости
        document.getElementById('speedDisplay').textContent = speed.toFixed(2);

        if (speed > 500 && (currentTime - lastVibration) > vibrationDelay) { 
            // Увеличенный порог чувствительности + задержка
            vibratePhone();
            lastVibration = currentTime; // Обновляем время последней вибрации
            console.log('Device shaken! Speed:', speed);
        }

        lastX = x;
        lastY = y;
        // lastZ = z;  // Не обновляем Z
    }
}

function vibratePhone() {
    if (navigator.vibrate) {
        navigator.vibrate(200); // Вибрация на 200 мс
    } else {
        console.log('Vibration API not supported on this device.');
    }
}








