
const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');
const socialIcons = document.querySelectorAll('.social-icon');

const swiper = new Swiper('.swiper-container', {
    spaceBetween: parseFloat(pxToRem(20)),
    slidesPerView: 'auto',
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

// Функция для конвертации px в rem
function pxToRem(px) {
    return px / 16 + 'rem';
}

document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: true,
    });
});


AOS.init({
    duration: 500,
    once: true
    
}); 

document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menuIcon");
    const toolsPanel = document.getElementById("toolsPanel");

    // Переключаем состояние панели при клике на кнопку
    menuIcon.addEventListener("mousedown", (event) => {
        event.stopPropagation(); // Предотвращаем всплытие события, чтобы не сработал обработчик ниже
        toolsPanel.classList.toggle("active"); // Переключаем класс "active"
    });

    // Закрываем панель, если клик был вне панели и кнопки
    document.addEventListener("mousedown", (event) => {
        if (!toolsPanel.contains(event.target) && !menuIcon.contains(event.target)) {
            toolsPanel.classList.remove("active"); // Убираем класс "active", скрывая панель
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const snowflakesContainer = document.getElementById("snowflakes");

    // Функция для создания снежинки
    function createSnowflake() {
        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");
        
        // Генерируем случайные параметры для каждой снежинки
        const size = Math.random() * 11 + 4; // Размер снежинки от 5px до 15px
        const leftPosition = Math.random() * 100; // Позиция по горизонтали
        const animationDuration = Math.random() * 15 + 5; // Длительность анимации от 5 до 10 секунд

        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${leftPosition}%`;
        snowflake.style.animationDuration = `${animationDuration}s`;

        snowflakesContainer.appendChild(snowflake);

        // Удаляем снежинку, когда она достигнет нижней части экрана, чтобы не перегружать DOM
        setTimeout(() => {
            snowflake.remove();
        }, animationDuration * 979);
    }

    // Создаем снежинки каждую секунду
    setInterval(createSnowflake, 170);
});