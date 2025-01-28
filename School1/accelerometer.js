if ('ondevicemotion' in window) {
    window.addEventListener('devicemotion', handleDeviceMotion);
} else {
    console.log('Device Motion API not supported on this device.');
}

let lastUpdate = 0;
        let lastVibration = 0;
        let vibrationDelay = 400; // Задержка между вибрациями (мс)
        let x = y = z = lastX = lastY = lastZ = 0;

        function checkVibrationSupport() {
            if (navigator.vibrate === undefined) {
                console.log('Vibration is not supported by this browser.');
                isVibrationEnabled = false; // Отключаем вибрацию, если она не поддерживается
                document.getElementById('vibrationToggle').disabled = true; // Отключаем тумблер
            } else {
                console.log('Vibration is supported by this browser.');
            }
        }

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
                    vibratePhone();
                    showPopup();  // Показываем окно при тряске
                    lastVibration = currentTime;
                    console.log('Device shaken! Speed:', speed);
                }

                lastX = x;
                lastY = y;
            }
        }

        function vibratePhone() {
            if (navigator.vibrate) {
                navigator.vibrate(200); // Вибрация на 200 мс
            } else {
                console.log('Vibration API not supported on this device.');
            }
        }

        function showPopup() {
            const popup = document.getElementById('vibrationPopup');
            popup.style.display = 'block';

            setTimeout(() => {
                popup.style.display = 'none'; // Скрываем окно через 2 секунды
            }, 2000);
        }

        checkVibrationSupport();

        window.addEventListener('devicemotion', handleDeviceMotion);

// Проверка, поддерживает ли браузер вибрацию
checkVibrationSupport();








