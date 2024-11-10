// Инициализация Swiper
const swiper = new Swiper('.swiper-container', {
    // Настройка пространства между слайдами
    spaceBetween: 10,  // Расстояние между слайдами
    slidesPerView: 'auto',  // Автоматическое количество слайдов, зависит от ширины
    loop: true,  // Зацикливаем слайды
    autoplay: {
        delay: 3500,  // Интервал между прокрутками (в миллисекундах)
        disableOnInteraction: false,  // Отключить автоматическую прокрутку, если пользователь взаимодействует
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
