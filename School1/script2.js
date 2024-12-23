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

document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menuIcon");
    const toolsPanel = document.getElementById("toolsPanel");
    const links = toolsPanel.querySelectorAll('a');

    menuIcon.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        toolsPanel.classList.toggle("active");

        if (navigator.vibrate) {
            navigator.vibrate([5]);
        }
    });

    links.forEach(link => {
        link.addEventListener("click", (event) => {
            if (navigator.vibrate) {
                navigator.vibrate(5);
            }
        });
    });

    document.addEventListener("mousedown", (event) => {
        if (!toolsPanel.contains(event.target) && !menuIcon.contains(event.target)) {
            toolsPanel.classList.remove("active");
        }
    });
    
    const themeToggle = document.getElementById("themeToggle");
    themeToggle.addEventListener("click", () => {

        if (navigator.vibrate) {
            navigator.vibrate(5);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const snowflakesContainer = document.getElementById("snowflakes");
    const maxSnowflakes = 45;

    function createSnowflake() {
        if (snowflakesContainer.children.length >= maxSnowflakes) {
            return;
        }

        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");

        const size = Math.random() * 19 + 5;
        const leftPosition = Math.random() * 97;
        const animationDuration = Math.random() * 15 + 5;

        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${leftPosition}%`;
        snowflake.style.animationDuration = `${animationDuration}s`;

        const rotation = Math.random() * 360;
        snowflake.style.transform = `rotate(${rotation}deg)`;

        snowflakesContainer.appendChild(snowflake);

        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
        });
    }

    function snowflakesLoop() {
        createSnowflake();
        setTimeout(() => {
            requestAnimationFrame(snowflakesLoop);
        }, 300);
    }

    snowflakesLoop();
});

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");

    document.body.style.transition = "background-color 0.3s, color 0.3s";
    themeToggle.style.transition = "transform 0.4s ease-in-out, opacity 0.2s ease-in-out";
    document.documentElement.style.transition = "background-color 0.3s";

    themeToggle.style.opacity = "0";
    themeToggle.style.transform = "rotate(180deg)";

    function setTheme(theme) {
        if (theme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
            document.documentElement.style.backgroundColor = "#ffffff";
            themeToggle.style.backgroundImage = "url('images/sun.svg')";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            document.documentElement.style.backgroundColor = "#0e1213";
            themeToggle.style.backgroundImage = "url('images/moon.svg')";
        }
    }

    const savedTheme = localStorage.getItem("theme") || 
                      (window.matchMedia('(prefers-color-scheme: light)').matches ? "light" : "dark");
    setTheme(savedTheme);

    requestAnimationFrame(() => {
        themeToggle.style.opacity = "1";
        themeToggle.style.transform = "rotate(0deg)";
    });

    themeToggle.addEventListener("click", () => {
        themeToggle.style.transform = "rotate(180deg)";
        themeToggle.style.opacity = "0";
        
        setTimeout(() => {
            const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
            
            themeToggle.style.opacity = "1";
            themeToggle.style.transform = "rotate(0deg)";
        }, 200);
    });
});
