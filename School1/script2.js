
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

document.addEventListener("click", function(event) {
    var menu = document.getElementById("toolsPanel");
    var menuIcon = document.querySelector(".menu-icon");

    // Если клик был вне панели и кнопки, то скрыть панель
    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.classList.remove("active");
        menuIcon.style.display = 'flex'; // Показываем кнопку обратно, если панель скрыта
    }
});

// Находим элементы
const menuIcon = document.querySelector('.menu-icon');
const toolsPanel = document.querySelector('.tools-panel');

// Добавляем событие на клик по гамбургеру
menuIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Чтобы клик по кнопке не приводил к срабатыванию события в document
    // Переключаем класс активного состояния на гамбургере
    menuIcon.classList.toggle('active');
    // Переключаем класс активного состояния на панели
    toolsPanel.classList.toggle('active');

    // Когда панель активна, скрываем кнопку
    if (toolsPanel.classList.contains("active")) {
        menuIcon.style.display = 'none'; // Скрываем кнопку
    } else {
        menuIcon.style.display = 'flex'; // Показываем кнопку обратно
    }
});