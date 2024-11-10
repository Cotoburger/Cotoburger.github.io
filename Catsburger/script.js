// Инициализация Swiper
const swiper = new Swiper('.swiper-container', {
    spaceBetween: 20,
    slidesPerView: '1',
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

// Находим все изображения на странице и аватарку
const images = document.querySelectorAll('img');
const avatar = document.querySelector('.avatar');

// Добавим CSS-анимацию с увеличенной длительностью
const addTransition = (img) => {
    img.style.transition = 'opacity 2s cubic-bezier(0.1, 0, 0.2, 0.1)';  // Изменена длительность анимации на 2 секунды
};

// Отслеживание события прокрутки
window.addEventListener('scroll', () => {
    if (scrollY > 100) {
        // Меняем фон на белый и делаем изображения прозрачными
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';

        images.forEach((img) => {
            if (img !== avatar) {
                addTransition(img);  // Применяем анимацию для всех изображений
                img.style.opacity = '0';  // Изображение становится прозрачным
            }
        });
    } else {
        // Восстанавливаем исходный фон и изображения
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#b9b4b4';

        images.forEach((img) => {
            if (img !== avatar) {
                addTransition(img);  // Применяем анимацию для всех изображений
                img.style.opacity = '1';  // Восстанавливаем полную непрозрачность
            }
        });
    }
});
