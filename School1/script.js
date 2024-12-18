
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



const schedule = {
    1: {
        shift1: [
            {lesson: "Классный час", start: "08:15", end: "08:45"},
            {lesson: "1-й урок", start: "08:55", end: "09:35"},
            {lesson: "2-й урок", start: "09:50", end: "10:30"},
            {lesson: "3-й урок", start: "10:45", end: "11:25"},
            {lesson: "4-й урок", start: "11:30", end: "12:10"},
            {lesson: "5-й урок", start: "12:20", end: "13:00"},
            {lesson: "6-й урок", start: "13:20", end: "14:00"},
            {lesson: "7-й урок", start: "14:15", end: "14:55"},
        ],
        shift2: [
            {lesson: "0-й урок", start: "12:20", end: "13:00"},
            {lesson: "1-й урок", start: "13:20", end: "14:00"},
            {lesson: "2-й урок", start: "14:15", end: "14:55"},
            {lesson: "3-й урок", start: "15:10", end: "15:50"},
            {lesson: "Классный час", start: "16:05", end: "16:35"},
            {lesson: "4-й урок", start: "16:40", end: "17:20"},
            {lesson: "5-й урок", start: "17:30", end: "18:10"},
            {lesson: "6-й урок", start: "18:20", end: "19:00"},
        ]
    },
    2: {
        shift1: [
            {lesson: "1-й урок", start: "08:15", end: "08:55"},
            {lesson: "2-й урок", start: "09:05", end: "09:45"},
            {lesson: "3-й урок", start: "10:00", end: "10:40"},
            {lesson: "4-й урок", start: "11:00", end: "11:40"},
            {lesson: "5-й урок", start: "11:50", end: "12:30"},
            {lesson: "6-й урок", start: "12:50", end: "13:30"},
            {lesson: "7-й урок", start: "13:50", end: "14:30"},
        ],
        shift2: [
            {lesson: "0-й урок", start: "11:50", end: "12:30"},
            {lesson: "1-й урок", start: "12:50", end: "13:30"},
            {lesson: "2-й урок", start: "13:50", end: "14:30"},
            {lesson: "3-й урок", start: "14:45", end: "15:25"},
            {lesson: "4-й урок", start: "15:40", end: "16:20"},
            {lesson: "5-й урок", start: "16:30", end: "17:10"},
            {lesson: "6-й урок", start: "17:20", end: "18:00"},
        ]
    },
    3: {
        shift1: [
            {lesson: "1-й урок", start: "08:15", end: "08:55"},
            {lesson: "2-й урок", start: "09:05", end: "09:45"},
            {lesson: "3-й урок", start: "10:00", end: "10:40"},
            {lesson: "Классный час", start: "10:55", end: "11:25"},
            {lesson: "4-й урок", start: "11:30", end: "12:10"},
            {lesson: "5-й урок", start: "12:20", end: "13:00"},
            {lesson: "6-й урок", start: "13:20", end: "14:00"},
            {lesson: "7-й урок", start: "14:15", end: "14:55"},
        ],
        shift2: [
            {lesson: "0-й урок", start: "12:20", end: "13:00"},
            {lesson: "1-й урок", start: "13:20", end: "14:00"},
            {lesson: "2-й урок", start: "14:15", end: "14:55"},
            {lesson: "3-й урок", start: "15:10", end: "15:50"},
            {lesson: "Классный час", start: "16:05", end: "16:35"},
            {lesson: "4-й урок", start: "16:40", end: "17:20"},
            {lesson: "5-й урок", start: "17:30", end: "18:10"},
            {lesson: "6-й урок", start: "18:20", end: "19:00"},
        ]
    },
    4: {
        shift1: [
            {lesson: "1-й урок", start: "08:15", end: "08:55"},
            {lesson: "2-й урок", start: "09:05", end: "09:45"},
            {lesson: "3-й урок", start: "10:00", end: "10:40"},
            {lesson: "Классный час", start: "10:55", end: "11:25"},
            {lesson: "4-й урок", start: "11:30", end: "12:10"},
            {lesson: "5-й урок", start: "12:20", end: "13:00"},
            {lesson: "6-й урок", start: "13:20", end: "14:00"},
            {lesson: "7-й урок", start: "14:15", end: "14:55"},
        ],
        shift2: [
            {lesson: "0-й урок", start: "12:20", end: "13:00"},
            {lesson: "1-й урок", start: "13:20", end: "14:00"},
            {lesson: "2-й урок", start: "14:15", end: "14:55"},
            {lesson: "3-й урок", start: "15:10", end: "15:50"},
            {lesson: "Классный час", start: "16:05", end: "16:35"},
            {lesson: "4-й урок", start: "16:40", end: "17:20"},
            {lesson: "5-й урок", start: "17:30", end: "18:10"},
            {lesson: "6-й урок", start: "18:20", end: "19:00"},
        ]
    },
    5: {
        shift1: [
            {lesson: "1-й урок", start: "08:15", end: "08:55"},
            {lesson: "2-й урок", start: "09:05", end: "09:45"},
            {lesson: "3-й урок", start: "10:00", end: "10:40"},
            {lesson: "4-й урок", start: "11:00", end: "11:40"},
            {lesson: "5-й урок", start: "11:50", end: "12:30"},
            {lesson: "6-й урок", start: "12:50", end: "13:30"},
            {lesson: "7-й урок", start: "13:50", end: "14:30"},
        ],
        shift2: [
            {lesson: "0-й урок", start: "11:50", end: "12:30"},
            {lesson: "1-й урок", start: "12:50", end: "13:30"},
            {lesson: "2-й урок", start: "13:50", end: "14:30"},
            {lesson: "3-й урок", start: "14:45", end: "15:25"},
            {lesson: "4-й урок", start: "15:40", end: "16:20"},
            {lesson: "5-й урок", start: "16:30", end: "17:10"},
            {lesson: "6-й урок", start: "17:20", end: "18:00"},
           // {lesson: "ДЕБАГ", start: "00:00", end: "24:00"},
        ]
    }
};
const timeToSeconds = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60;
};

const convertScheduleToSeconds = (schedule) => {
    for (let day in schedule) {
        for (let shift in schedule[day]) {
            schedule[day][shift].forEach(lesson => {
                lesson.start = timeToSeconds(lesson.start);
                lesson.end = timeToSeconds(lesson.end);
            });
        }
    }
};

convertScheduleToSeconds(schedule);

const getCurrentTimeInSeconds = () => {
    const nowUTC = new Date().toISOString();
    const kamchatkaTime = new Date(nowUTC).toLocaleString('en-US', { timeZone: 'Asia/Kamchatka' });
    const kamchatkaDate = new Date(kamchatkaTime);
    return kamchatkaDate.getHours() * 3600 + kamchatkaDate.getMinutes() * 60 + kamchatkaDate.getSeconds();
};

const currentDay = new Date().getDay();

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
};

const getCurrentLesson = (shift) => {
    const currentTime = getCurrentTimeInSeconds();
    const lessons = schedule[currentDay]?.[shift] || [];

    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];

        if (currentTime >= lesson.start && currentTime < lesson.end) {
            const timeLeft = lesson.end - currentTime;
            return {
                lessonName: lesson.lesson,
                timeLeft,
                isBreak: false,
                totalTime: lesson.end - lesson.start
            };
        }

        if (i < lessons.length - 1 && currentTime >= lesson.end && currentTime < lessons[i + 1].start) {
            const timeLeft = lessons[i + 1].start - currentTime;
            return {
                lessonName: "Перемена",
                timeLeft,
                isBreak: true
            };
        }
    }

    return { lessonName: null, timeLeft: 0, isBreak: false, totalTime: 0 };
};

const updateCurrentLessons = () => {
    const currentLessonShift1 = getCurrentLesson('shift1');
    const currentLessonShift2 = getCurrentLesson('shift2');

    document.getElementById("currentLessonShift1").innerHTML = `Первая смена`;
    if (currentLessonShift1.lessonName) {
        if (currentLessonShift1.isBreak) {
            document.getElementById("lessonShift1").innerHTML = "Перемена";
            document.getElementById("timeLeftShift1").innerHTML = formatTime(currentLessonShift1.timeLeft);
            document.getElementById("progressShift1").style.display = 'none';
        } else {
            document.getElementById("lessonShift1").innerHTML = `${currentLessonShift1.lessonName}`;
            document.getElementById("timeLeftShift1").innerHTML = formatTime(currentLessonShift1.timeLeft);
            // Заполняем прогресс-бар
            const progress = ((currentLessonShift1.totalTime - currentLessonShift1.timeLeft) / currentLessonShift1.totalTime) * 100;
            document.getElementById("progressShift1").style.display = 'inline-block';
            document.getElementById("progressShift1").value = progress;
        }
    } else {
        document.getElementById("lessonShift1").innerHTML = "Нет уроков";
        document.getElementById("timeLeftShift1").innerHTML = "";
        document.getElementById("progressShift1").style.display = 'none';
    }

    // Обновляем информацию для 2-й смены
    document.getElementById("currentLessonShift2").innerHTML = `Вторая смена`;
    if (currentLessonShift2.lessonName) {
        if (currentLessonShift2.isBreak) {
            document.getElementById("lessonShift2").innerHTML = "Перемена";
            document.getElementById("timeLeftShift2").innerHTML = formatTime(currentLessonShift2.timeLeft);
            document.getElementById("progressShift2").style.display = 'none';
        } else {
            document.getElementById("lessonShift2").innerHTML = `${currentLessonShift2.lessonName}`;
            document.getElementById("timeLeftShift2").innerHTML = formatTime(currentLessonShift2.timeLeft);
            // Заполняем прогресс-бар
            const progress = ((currentLessonShift2.totalTime - currentLessonShift2.timeLeft) / currentLessonShift2.totalTime) * 100;
            document.getElementById("progressShift2").style.display = 'inline-block';
            document.getElementById("progressShift2").value = progress;
        }
    } else {
        document.getElementById("lessonShift2").innerHTML = "Нет уроков";
        document.getElementById("timeLeftShift2").innerHTML = "";
        document.getElementById("progressShift2").style.display = 'none';
    }
};

updateCurrentLessons();

setInterval(updateCurrentLessons, 1000);


AOS.init({
    duration: 500,
    once: true
    
}); 

document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menuIcon");
    const toolsPanel = document.getElementById("toolsPanel");

    menuIcon.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        toolsPanel.classList.toggle("active");
    });

    document.addEventListener("mousedown", (event) => {
        if (!toolsPanel.contains(event.target) && !menuIcon.contains(event.target)) {
            toolsPanel.classList.remove("active");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const snowflakesContainer = document.getElementById("snowflakes");
    const snowflakes = [];
    let tiltX = 0;

    function createSnowflake() {
        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");

        const size = Math.random() * 11 + 4; // Размер снежинки
        const leftPosition = Math.random() * 97; // Начальная горизонтальная позиция
        const animationDuration = Math.random() * 15 + 5; // Длительность падения

        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${leftPosition}%`;
        snowflake.style.animationDuration = `${animationDuration}s`;
        snowflake.style.top = `-10px`; // Начальная позиция над экраном

        snowflakesContainer.appendChild(snowflake);
        snowflakes.push({ element: snowflake, currentLeft: leftPosition });

        setTimeout(() => {
            snowflake.remove();
            snowflakes.splice(snowflakes.findIndex((sf) => sf.element === snowflake), 1);
        }, animationDuration * 1000);
    }

    setInterval(createSnowflake, 175);

    window.addEventListener("devicemotion", (event) => {
        const acceleration = event.accelerationIncludingGravity;
        tiltX = acceleration.x || 0;

        // Обновляем горизонтальные позиции снежинок
        snowflakes.forEach((snowflakeObj) => {
            const { element, currentLeft } = snowflakeObj;

            // Смещение снежинки в зависимости от наклона устройства
            const newLeft = currentLeft + tiltX * -0.01;

            // Обновляем текущую позицию и стиль
            snowflakeObj.currentLeft = Math.min(Math.max(newLeft, -45), 145); // Ограничиваем в пределах 0-100%
            element.style.left = `${snowflakeObj.currentLeft}%`;
        });
    });
});