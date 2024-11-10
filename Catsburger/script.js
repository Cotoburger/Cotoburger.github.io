// Инициализация Swiper
const swiper = new Swiper('.swiper-container', {
    // Настройка пространства между слайдами
    spaceBetween: 20,  // Расстояние между слайдами
    slidesPerView: 'auto',  // Автоматическое количество слайдов, зависит от ширины
    loop: true,  // Зацикливаем слайды
    autoplay: {
        delay: 2500,  // Интервал между прокрутками (в миллисекундах)
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

// Находим все изображения на странице и аватарку
const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');

// Отслеживание события прокрутки
window.addEventListener('scroll', () => {
    if (scrollY > 400) {
        // Меняем фон на белый и делаем изображения прозрачными
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';

        images.forEach((img) => {
            // Пропускаем аватарку, изменяем прозрачность только других изображений
            if (img !== avatar) {
                img.style.opacity = '0';
            }
        });
    } else {
        // Восстанавливаем исходный фон и изображения
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#b9b4b4';

        images.forEach((img) => {
            if (img !== avatar) {
                img.style.opacity = '1';
            }
        });
    }
});


