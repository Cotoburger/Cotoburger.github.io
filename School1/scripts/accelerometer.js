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
        if (speed > 360 && (currentTime - lastVibration) > vibrationDelay && !isPopupVisible) {
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

    // Добавляем задержку перед мониторингом движения
    setTimeout(() => {
        monitorPopupMotion();
    }, 600); // Задержка 600ms перед началом мониторинга движения

    // Плавно скрываем окно через 4.5 секунды
    setTimeout(() => {
        popup.style.opacity = '0'; // Начинаем скрывать окно
    }, 3500); // Начинаем скрывать через 4.5 секунды после показа

    // Полностью скрываем окно через 5 секунд и сбрасываем флаг активности
    setTimeout(() => {
        popup.style.display = 'none';
        isPopupVisible = false; // Сбрасываем флаг, чтобы разрешить активацию окна снова
    }, 4000); // Окончательное скрытие через 5 секунд
}

let gravity = { x: 0, y: 0, z: 0 };
const alpha = 0.8; // Коэффициент фильтрации
let isFirstMotion = true; // Флаг для первой обработки

function monitorPopupMotion() {
    let hasTriggered = false; // Флаг для отслеживания, было ли уже срабатывание
    const popup = document.getElementById('vibrationPopup'); // Получаем элемент popup

    const motionListener = (event) => {
        if (hasTriggered) return; // Если уже сработало, выходим из функции

        const acc = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };

        // Фильтрация гравитации
        gravity.x = alpha * gravity.x + (1 - alpha) * acc.x;
        gravity.y = alpha * gravity.y + (1 - alpha) * acc.y;
        gravity.z = alpha * gravity.z + (1 - alpha) * acc.z;

        // Линейное ускорение (без гравитации)
        const linear_acceleration = {
            x: acc.x - gravity.x,
            y: acc.y - gravity.y,
            z: acc.z - gravity.z
        };

        // Вычисляем длину вектора гравитации
        const gravityMagnitude = Math.sqrt(gravity.x ** 2 + gravity.y ** 2 + gravity.z ** 2);

        // Нормализуем вектор гравитации
        const normalizedGravity = {
            x: gravity.x / gravityMagnitude,
            y: gravity.y / gravityMagnitude,
            z: gravity.z / gravityMagnitude
        };

        // Вычисляем вертикальное ускорение как проекцию линейного ускорения на вектор гравитации
        const vertical_acceleration =
            linear_acceleration.x * normalizedGravity.x +
            linear_acceleration.y * normalizedGravity.y +
            linear_acceleration.z * normalizedGravity.z;

        console.log('Vertical acceleration:', vertical_acceleration.toFixed(1));

        // Фильтруем малые изменения
        if (Math.abs(vertical_acceleration) < 1.5) { // Чувствительность можно настроить
            return;
        }

        // Добавляем задержку для фильтрации резких изменений при старте
        if (isFirstMotion) {
            setTimeout(() => {
                isFirstMotion = false; // Ожидаем немного перед первым срабатыванием
            }, 100);
            return;
        }

        if (vertical_acceleration > 4) { // Телефон движется вверх
            console.log('Phone moving upwards');
            handleMotion('phoneup', 'https://isaacdeve.github.io/');
        } else if (vertical_acceleration < -4) { // Телефон движется вниз
            console.log('Phone moving downwards');
            handleMotion('phonedown', 'https://h2o0o0o.github.io/#home');
        }
    };

    const handleMotion = (animationClass, url) => {
        popup.classList.add(animationClass); // Добавляем класс для анимации

        // Ожидаем завершения анимации, прежде чем выполнить действие
        setTimeout(() => {
            window.open(url, '_blank'); // Открываем сайт
        }, 480); // Пауза в 500ms для завершения анимации

        setTimeout(() => {
            popup.classList.remove(animationClass); // Убираем класс анимации
        }, 500); // Убираем класс после завершения анимации

        hasTriggered = true; // Устанавливаем флаг, чтобы предотвратить повторное срабатывание

        // Удаляем обработчик событий для оптимизации
        window.removeEventListener('devicemotion', motionListener);
    };

    // Добавляем слушатель событий движения устройства
    window.addEventListener('devicemotion', motionListener);

    // Убираем слушатель после закрытия попапа
    setTimeout(() => {
        window.removeEventListener('devicemotion', motionListener);
        console.log('Motion listener removed');
    }, 4000); // Длительность проверки совпадает с показом попапа
}

window.addEventListener('devicemotion', handleDeviceMotion);