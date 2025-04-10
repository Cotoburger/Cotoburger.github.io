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
    const themeToggle = document.getElementById("themeToggle");
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const header = document.querySelector('.header-container'); // 💡 ВОТ ЭТА СТРОКА — ключ

    document.body.style.transition = "background-color 0.4s, color 0.4s";
    themeToggle.style.transition = "transform 0.5s ease-in-out, opacity 0.3s ease-in-out";
    document.documentElement.style.transition = "background-color 0.5s";

    function setTheme(theme) {
        if (theme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
            document.documentElement.style.backgroundColor = "rgba(232, 243, 252, 0.82)";
            themeToggle.style.backgroundImage = "url('images/sun.svg')";
            themeColorMeta?.setAttribute("content", "rgba(232, 243, 252, 0.82)");
            header.style.backgroundColor = "rgb(232, 243, 252)";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            document.documentElement.style.backgroundColor = "#090c0f";
            themeToggle.style.backgroundImage = "url('images/moon.svg')";
            themeColorMeta?.setAttribute("content", "#090c0f");
            header.style.backgroundColor = "rgb(9, 12, 15)";
        }
    }

    const savedTheme = localStorage.getItem("theme") ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? "light" : "dark");
    setTheme(savedTheme);

    themeToggle.style.opacity = "1";
    themeToggle.style.transform = "rotate(0deg)";

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