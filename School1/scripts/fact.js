const bannedWords = ['sex', 'orgasm']; // Список "банвордов"
let isFetchingFact = false;
let isTranslated = false;

// Проверка наличия сохранённого состояния
const lastTranslated = localStorage.getItem('lastTranslated');
if (lastTranslated) {
    isTranslated = lastTranslated === 'true';
}

function containsBannedWord(text) {
    return bannedWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
}

function getFact() {
    if (isFetchingFact) return; // Предотвращение множественных запросов
    isFetchingFact = true;

    const factText = document.getElementById('fact-text');
    factText.textContent = '...'; // Показываем сообщение о загрузке

    fetchFact();

    function fetchFact() {
        fetch('https://uselessfacts.jsph.pl/random.json?language=en')
            .then(response => response.json())
            .then(data => {
                const txt = data.text;

                if (containsBannedWord(txt)) {
                    console.warn('Факт содержит запрещённое слово, делаем новый запрос.');
                    fetchFact(); // Повторяем запрос
                    return;
                }

                const factContent = document.querySelector('.fact-content');
                factContent.style.opacity = '1';

                if (isTranslated) {
                    translateFactWithAnimation(txt); // Если нужно, переводим и показываем
                } else {
                    displayFactWithTyping(txt); // Если не нужно, просто показываем факт
                }

                factText.onclick = () => {
                    toggleTranslation(txt); // Добавляем обработчик для перевода
                };

                isFetchingFact = false; // Сбрасываем флаг после успешного выполнения
            })
            .catch(error => {
                console.error('Ошибка при получении факта:', error);
                factText.textContent = 'Не удалось загрузить факт дня.';
                isFetchingFact = false; // Сбрасываем флаг в случае ошибки
            });
    }
}

function translateFactWithAnimation(text) {
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ru`)
        .then(response => response.json())
        .then(data => {
            if (data.responseStatus && data.responseStatus === 429) {
                const factText = document.getElementById('fact-text');
                factText.textContent = 'Ошибка лимита запросов. Попробуйте позже.';
                return;
            }

            const translatedText = data.responseData ? data.responseData.translatedText : 'Не удалось перевести факт.';
            displayFactWithTyping(translatedText); // Запускаем анимацию печатания переведенного текста

            isTranslated = true;
            localStorage.setItem('lastTranslated', 'true');
        })
        .catch(error => {
            console.error('Ошибка при переводе:', error);
            const factText = document.getElementById('fact-text');
            factText.textContent = 'Не удалось перевести факт.';
        });
}

function displayFactWithTyping(text) {
    const factText = document.getElementById('fact-text');
    factText.innerHTML = ''; // Очищаем текущий текст

    const typingSpan = document.createElement('span');
    typingSpan.className = 'typing-effect';
    factText.appendChild(typingSpan);

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typingSpan.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 15); // Увеличил задержку для медленного набора текста
        } else {
            isFetchingFact = false; // Сбрасываем флаг после завершения печати
        }
    }

    typeWriter(); // Начинаем анимацию печатания
}

function toggleTranslation(txt) {
    const factText = document.getElementById('fact-text');

    if (isTranslated) {
        // Fade-out before switching to English
        factText.style.transition = 'opacity 0.3s';
        factText.style.opacity = '0';

        setTimeout(() => {
            factText.textContent = txt;
            factText.style.opacity = '1';
            displayFactWithTyping(txt); // Применяем анимацию печатания
        }, 300); // Ждём окончания анимации перед заменой текста

        isTranslated = false;
        localStorage.setItem('lastTranslated', 'false');
    } else {
        translateFactWithAnimation(txt); // Переводим и показываем
    }
}

window.addEventListener('load', getFact);

/* Стили */
const style = document.createElement('style');
style.textContent = `
    .sectionz {
        transition: transform 0.3s, background-color 0.3s;
        display: inline-block;
        padding: 10px;
        border-radius: 5px;
    }
    #fact-text:hover {
        background-color: rgba(0, 0, 0, 0.06);
    }
    #fact-text:active {
        transform: scale(0.95);
        background-color: rgba(102, 178, 249, 0.26);
    }
`;
document.head.appendChild(style);
