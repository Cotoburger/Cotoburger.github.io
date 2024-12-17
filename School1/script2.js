
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

const menuIcon = document.getElementById("menuIcon");

menuIcon.addEventListener("pointerdown", toggleMenu); // моментальное срабатывание

AOS.init({
    duration: 500,
    once: true
    
}); 

document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menuIcon");
    const toolsPanel = document.getElementById("toolsPanel");

    menuIcon.addEventListener("click", (event) => {
        event.stopPropagation(); // Не передаём клик дальше
        toolsPanel.classList.toggle("active");
        menuIcon.style.display = toolsPanel.classList.contains("active") ? "none" : "flex";
    });

    // Закрываем меню при клике вне его
    document.addEventListener("click", (event) => {
        if (!toolsPanel.contains(event.target) && !menuIcon.contains(event.target)) {
            toolsPanel.classList.remove("active");
            menuIcon.style.display = "flex";
        }
    });
});