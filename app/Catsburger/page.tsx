"use client"

import Image from "next/image";
import Link from "next/link";
import NaviBookImage from "@/public/Монтажная область 1.png"
import TaylorSwiftTestBanner from "@/public/tstgitbaner4.png"
import Avatar from "@/public/avatar.png"
import {useEffect, useState} from "react";
import Swiper from "@/app/Catsburger/Swiper";
import Github from "@/public/github.png"
import Steam from "@/public/steam.png"
import WeatherAndTime from "@/app/Catsburger/weather";
import schedule, {dayNames} from "@/app/Catsburger/schedule";

const getKamchatkaTime = () => {
    // Получаем текущее UTC время
    const now = new Date();

    // Камчатка - UTC +12
    const kamchatkaOffset = 12 * 60; // В минутах (12 часов * 60 минут)

    // Получаем текущие компоненты времени
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
    const utcMilliseconds = now.getUTCMilliseconds();

    // Добавляем смещение для Камчатки (12 часов)
    const kamchatkaHours = (utcHours + 12) % 24; // Используем % 24, чтобы часы не выходили за 24
    const kamchatkaMinutes = (utcMinutes + 0) % 60; // Нет необходимости в добавлении, но можно для совместимости
    const kamchatkaSeconds = (utcSeconds + 0) % 60; // Аналогично

    // Возвращаем объект с компонентами времени
    return {
        hours: kamchatkaHours,
        minutes: kamchatkaMinutes,
        seconds: kamchatkaSeconds,
        day: now.getDate(),
        month: now.getMonth() + 1, // Месяцы начинаются с 0, поэтому прибавляем 1
        year: now.getFullYear()
    };
};

const updateProgress = (lesson: any, currentKamchatkaTime: any) => {
    const lessonStartTime = lesson.start.split(":");
    const lessonEndTime = lesson.end.split(":");

    const isLessonActive =
        (currentKamchatkaTime.hours > Number(lessonStartTime[0]) ||
            (currentKamchatkaTime.hours === Number(lessonStartTime[0]) && currentKamchatkaTime.minutes >= Number(lessonStartTime[1]))) &&
        (currentKamchatkaTime.hours < Number(lessonEndTime[0]) ||
            (currentKamchatkaTime.hours === Number(lessonEndTime[0]) && currentKamchatkaTime.minutes < Number(lessonEndTime[1])));

    const lessonEndInMinutes =
        (Number(lessonEndTime[0]) - currentKamchatkaTime.hours) * 60 +
        (Number(lessonEndTime[1]) - currentKamchatkaTime.minutes);

    const progressValue = ((60-lessonEndInMinutes) / 60) * 100;

    return { isLessonActive, progressValue, lessonEndInMinutes };
};

export default function Home() {
    const [scrollY, setScrollY] = useState(0);
    const [scrollTimeout, setScrollTimeout] = useState<number | undefined>();
    const [currentKamchatkaTime, setCurrentKamchatkaTime] = useState(getKamchatkaTime())

    useEffect(() => {
        setInterval(() => {setCurrentKamchatkaTime(getKamchatkaTime())}, 10000)
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setScrollY(window.scrollY);
        })
    })

    useEffect(() => {
        const video = document.getElementById("background-video")!;
        const images = document.querySelectorAll('img');
        const avatar = document.querySelector('.avatar');
        const socialIcons = document.querySelectorAll('.social-icon'); // Изображения соцсетей
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        setScrollTimeout(requestAnimationFrame(() => {
            const h1h2Elements = document.querySelectorAll('h1, h2'); // Получаем все заголовки h1 и h2
            const avtextElement = document.querySelector('.avtext') as HTMLHRElement; // Ваш никнейм

            if (scrollY > 400) {
                // Тёмная тема
                document.body.style.backgroundColor = '#02090e'; // САМОЕ ВАЖНОЕ
                document.body.style.color = '#4f99c1'; // ЦВЕТ ТЕКСТА

                images.forEach((img) => {
                    if (img !== avatar && !socialIcons.values().toArray().includes(img)) { // Исключаем иконки соцсетей
                        img.style.opacity = '0'; // Пропускаем аватарку и изображения соцсетей
                    }
                });

                // Меняем цвет для h1, h2 и никнейма
                h1h2Elements.forEach((el: Element) => {
                    (el as HTMLHRElement).style.color = '#1a4b8e'; // Цвет заголовков в темной теме
                });

                if (avtextElement) {
                    avtextElement.style.color = '#1a4b8e'; // Меняем цвет никнейма в темной теме
                }

            } else {
                // Светлая тема
                document.body.style.backgroundColor = '#000000';
                document.body.style.color = '#b9b4b4';

                images.forEach((img) => {
                    if (img !== avatar && !socialIcons.values().toArray().includes(img)) { // Исключаем иконки соцсетей
                        img.style.opacity = '1'; // Восстанавливаем изображения
                    }
                });

                // Меняем цвет для h1, h2 и никнейма на светлый
                h1h2Elements.forEach((el) => {
                    (el as HTMLHRElement).style.color = '#78b89a'; // Цвет заголовков в светлой теме
                });

                if (avtextElement) {
                    avtextElement.style.color = '#78b89a'; // Меняем цвет никнейма в светлой теме
                }
            }
        }));
    }, [scrollY]);

    useEffect(() => {
        const video = document.getElementById('background-video')! as HTMLVideoElement;

        video.volume = 0;
        let isFading = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    fadeInVolume(video);
                } else {
                    fadeOutVolume(video);
                }
            });
        }, {
            threshold: 0.5
        });

        observer.observe(video);
        function fadeInVolume(videoElement: HTMLVideoElement) {
            if (isFading) return;
            isFading = true;
            const fadeInInterval = setInterval(() => {
                if (videoElement.volume < 0.8) {
                    videoElement.volume = Math.min(videoElement.volume + 0.05, 1);
                } else {
                    clearInterval(fadeInInterval);
                    isFading = false;
                }
            }, 20);
        }

        function fadeOutVolume(videoElement: HTMLVideoElement) {
            if (isFading) return;
            isFading = true;
            const fadeOutInterval = setInterval(() => {
                if (videoElement.volume > 0.2) {
                    videoElement.volume = Math.max(videoElement.volume - 0.05, 0);
                } else {
                    clearInterval(fadeOutInterval);
                    isFading = false;
                }
            }, 20);
        }
    }, []);

    useEffect(() => {
        function updateKamchatkaTime() {
            const timeElement = document.getElementById("local-time") as HTMLDivElement;
            const options = {
                timeZone: 'Asia/Kamchatka',
                hour: "2-digit",
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            };

            // @ts-ignore
            const currentTime = new Intl.DateTimeFormat('ru-RU', options).format(new Date());
            timeElement.textContent = `time: ${currentTime}`;
        }

        setInterval(updateKamchatkaTime, 1000);
        updateKamchatkaTime();
    }, []);



    return (
        <main className="overflow-y-clip">
            <header className="header">
                <h1>Catsburger Web</h1>
            </header>

            <Swiper images={[{
                url: "https://cotoburger.github.io/NaviBook/",
                image: NaviBookImage
            }, {url: "https://github.com/Cotoburger/TaylorSwiftTest", image: TaylorSwiftTestBanner}]}/>

            <div className="avatar-container">
                <Image src={Avatar} alt="Avatar" className="avatar"/>
                <h1 className="avtext">Catsburger</h1>
            </div>

            <section id="overview" className="section">
                <h2>Hello</h2>
                <h3>My name is Alexey. I'm from Petropavlovsk-Kamchatsky, Russia. I've been interested in
                    HTML/JavaScript
                    since early childhood. I can also write code in C++. I'm a professional player in the sandbox game
                    Scrap
                    Mechanic. I really enjoy listening to Taylor Swift and Olivia Rodrigo.</h3>
            </section>

            <div className="h-full flex gap-8 transition-all duration-200 -my-4 weather-lessons mx-[25px]">
                <WeatherAndTime/>

                {new Date().getDay() >= 1 && new Date().getDay() <= 5 ? (
                    <section id="lessons" className="section !w-full !pr-6 transition-all !mx-0">
                        <h2>
                            {dayNames[new Date().getDay()]} lessons
                            <hr />
                            <p>1st shift:</p>
                            <ul>
                                {/*// @ts-ignore*/}
                                {schedule[new Date().getDay()]?.shift1.map((lesson, index) => {
                                    const { isLessonActive, progressValue, lessonEndInMinutes } = updateProgress(lesson, currentKamchatkaTime);
                                    if (isLessonActive) console.log(progressValue)

                                    return isLessonActive ? (
                                        <div key={index}>
                                            <p>{lesson.lesson}</p>
                                            <progress max={100} value={progressValue} className="rounded-full" />
                                            <p>{lessonEndInMinutes} minutes to end</p>
                                        </div>
                                    ) : null;
                                })}
                            </ul>

                            <p>2nd shift:</p>
                            <ul>
                                {/*// @ts-ignore*/}
                                {schedule[new Date().getDay()]?.shift2.map((lesson, index) => {
                                    const { isLessonActive, progressValue, lessonEndInMinutes } = updateProgress(lesson, currentKamchatkaTime);

                                    return isLessonActive ? (
                                        <div key={index}>
                                            <p>{lesson.lesson}</p>
                                            <progress max={100} value={progressValue} className="rounded-full" />
                                            <p>{lessonEndInMinutes} minutes to end</p>
                                        </div>
                                    ) : null;
                                })}
                            </ul>
                        </h2>
                    </section>
                ) : null}
            </div>

            {/*Добавляем цикличное видео между overview и maintenance*/}
            <section id="video" className="videoback">
                <video width="100%" height="auto" loop controls preload="auto" playsInline
                       id="background-video" style={{borderRadius: "20px"}}>
                    <source src="/Josh Hutcherson __ Whistle (1).mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            </section>
            <section id="overview" className="section">
                <h2>My playlist</h2>
                <iframe style={{borderRadius: "20px"}}
                        src="https://open.spotify.com/embed/playlist/5kY91XNoqV7SUWOxbJR8JL?utm_source=generator"
                        width="100%"
                        height="370" frameBorder="0" allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"></iframe>
            </section>

            <section id="social-links" className="section3 !p-0 !pb-4">
                <div className="w-full h-auto flex place-items-center place-content-center gap-8">
                    <Link href="https://github.com/Cotoburger" target="_blank">
                        <Image src={Github} alt="GitHub" className="social-icon"/>
                    </Link>
                    <Link href="https://steamcommunity.com/id/Catsburger/" target="_blank">
                        <Image src={Steam} alt="Steam" className="social-icon"/>
                    </Link>
                </div>
            </section>

            {/*<script src={"/script.js"}></script>*/}
        </main>
    );
}
