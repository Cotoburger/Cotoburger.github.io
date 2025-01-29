let lastUpdate = 0;
let lastVibration = 0;
let vibrationDelay = 500; // Задержка между вибрациями (мс)
let x = 0, y = 0, z = 0, lastX = 0, lastY = 0, lastZ = 0; // Используем let для этих переменных
let isPopupVisible = false; // Флаг для проверки активности окна
let firstMeasurement = true; // Флаг для первого замера
let previousTime = 0;
let previousZ = 0;
let speedThreshold = 15;  // Порог для средней скорости

function handleDeviceMotion(event) {
    let acceleration = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 }; // Убедитесь, что используете let
    let currentTime = new Date().getTime(); // Используем let для текущего времени
    let z = acceleration.z;

    // Проверяем данные каждые 150 мс
    if ((currentTime - lastUpdate) > 150) {
        let timeDifference = (currentTime - lastUpdate) / 1000; // Используем let для вычисления разницы во времени
        lastUpdate = currentTime;

        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        console.log('Acceleration data:', { x, y, z }); // Логируем все данные акселерометра

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

// Функция для отображения попапа
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

    // Add a delay before monitoring motion
    setTimeout(() => {
        monitorPopupMotion();
    }, 500); // Delay of 500ms before starting to monitor motion

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

// Функция для мониторинга движения во время показа попапа
function monitorPopupMotion() {
    let hasTriggered = false; // Флаг для отслеживания, было ли уже срабатывание
    const popup = document.getElementById('vibrationPopup'); // Получаем элемент popup
    const motionListener = (event) => {
        if (hasTriggered) return; // Если уже сработало, выходим из функции
        const acceleration = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
        const z = acceleration.z;

        console.log('Acceleration data during popup:', { x: acceleration.x, y: acceleration.y, z });

        // Фильтруем малые изменения
        if (Math.abs(z) < 0.5) { // Увеличиваем порог чувствительности
            return;
        }

        // Мы делаем два замера ускорения
        if (firstMeasurement) {
            previousTime = new Date().getTime();
            previousZ = z;
            firstMeasurement = false;
            return;  // Ожидаем второй замер
        }

        // Второй замер
        const currentTime = new Date().getTime();
        const timeDifference = (currentTime - previousTime) / 1000; // Разница во времени между замерами (в секундах)
        const deltaZ = Math.abs(z - previousZ);  // Изменение ускорения по оси Z

        // Рассчитываем среднюю скорость
        const speed = deltaZ / timeDifference; // Средняя скорость между замерами

        console.log(`Time Difference: ${timeDifference}s, Delta Z: ${deltaZ}, Speed: ${speed} m/s`);

        // Проверяем, превышает ли средняя скорость порог
        if (speed > speedThreshold && !hasTriggered) {
            // Проверяем движение устройства вверх или вниз относительно земли
            if (speed > 150) { // Телефон движется вверх
                console.log('Phone moving upwards');
                popup.classList.add('phoneup'); // Добавляем анимацию для подъема телефона

                // Ожидаем завершения анимации, прежде чем открыть сайт
                setTimeout(() => {
                    window.open('https://isaacdeve.github.io/', '_blank'); // Открываем сайт при движении вверх
                }, 500); // Пауза в 500ms для завершения анимации

                setTimeout(() => {
                    popup.classList.remove('phoneup'); // Убираем класс анимации после завершения
                }, 500); // Убираем класс по завершению анимации
                hasTriggered = true; // Устанавливаем флаг, чтобы предотвратить повторное срабатывание

            } else if (speed < -100) { // Телефон движется вниз
                console.log('Phone moving downwards');
                popup.classList.add('phonedown'); // Добавляем анимацию для подъема телефона
                // Ожидаем завершения анимации, прежде чем открыть сайт
                setTimeout(() => {
                    window.open('https://h2o0o0o.github.io/#home', '_blank'); // Открываем сайт при движении вниз
                }, 500); // Пауза в 500ms для завершения анимации

                setTimeout(() => {
                    popup.classList.remove('phonedown'); // Убираем класс анимации после завершения
                }, 500); // Убираем класс по завершению анимации
                hasTriggered = true; // Устанавливаем флаг, чтобы предотвратить повторное срабатывание
            }
        }

        // Подготавливаемся к следующему замеру
        previousTime = currentTime;
        previousZ = z;
        firstMeasurement = true;  // Готовы к следующему замеру
    };

    window.addEventListener('devicemotion', motionListener);

    // Убираем слушатель после закрытия попапа
    setTimeout(() => {
        window.removeEventListener('devicemotion', motionListener);
        console.log('Motion listener removed');
    }, 5000); // Длительность проверки совпадает с показом попапа
}

window.addEventListener('devicemotion', handleDeviceMotion);