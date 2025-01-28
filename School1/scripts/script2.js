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

        // Привязываем функцию имитации тряски к кнопке
        document.getElementById('shakeButton').addEventListener('click', simulateShake)


