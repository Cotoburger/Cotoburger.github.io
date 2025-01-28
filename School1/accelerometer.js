if ('ondevicemotion' in window) {
    window.addEventListener('devicemotion', handleDeviceMotion);
} else {
    console.log('Device Motion API not supported on this device.');
}

let lastUpdate = 0;
        let lastVibration = 0;
        let vibrationDelay = 400; // Задержка между вибрациями (мс)
        let x = y = z = lastX = lastY = lastZ = 0;

        function handleDeviceMotion(event) {
            const acceleration = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
            const currentTime = new Date().getTime();

            if ((currentTime - lastUpdate) > 150) {
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

                if (speed > 500 && (currentTime - lastVibration) > vibrationDelay) {
                    showPopup();  // Показываем окно при тряске
                    lastVibration = currentTime;
                    console.log('Device shaken! Speed:', speed);
                }

                lastX = x;
                lastY = y;
            }
        }


        function showPopup() {
            const popup = document.getElementById('vibrationPopup');
            popup.style.display = 'block';

            setTimeout(() => {
                popup.style.display = 'none'; // Скрываем окно через 2 секунды
            }, 3000);
        }

        window.addEventListener('devicemotion', handleDeviceMotion);

// Проверка, поддерживает ли браузер вибрацию
checkVibrationSupport();








