import MobilePic from "@/public/mobilepic.png"
import MainPic from "@/public/mainpic.png"
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <Image className="large-image mobile-image" src={MobilePic} alt="Mobile Image" quality={100}/>
            <Image className="large-image desktop-image" src={MainPic} alt="Desktop Image" quality={100}/>

            <section id="overview" className="section">
                <h2>Overview</h2>
                <p>NaviBook is the most advanced mod-free laptop for playing Scrap Mechanic, combining a compact design
                    with
                    powerful capabilities that are unattainable for most other full-sized builds in the game.</p>
            </section>

            <section id="Internet" className="section2">
                <h2>Internet</h2>
                <p>Navibook has ultra-fast internet with which you can remotely control any of your buildings. And also
                    get
                    an image from them.</p>
            </section>

            {/*Добавляем цикличное видео между overview и maintenance*/}
            <section id="video" className="videoback">
                <video width="100%" height="auto" loop muted autoPlay preload="auto" playsInline
                       id="background-video" style={{borderRadius: "20px"}}>
                    <source src="/Scrap Mechanic 2024.11.10 - 02.30.18.03.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            </section>

            <script>
                {`
            // Получаем элемент видео
            const video = document.getElementById('background-video');

            // Устанавливаем функцию для повторного воспроизведения видео
            video.addEventListener('ended', () => {
            video.currentTime = 0; // Сбрасываем время видео
            video.play(); // Снова запускаем видео
            });

            // Запускаем видео сразу после загрузки
            video.play();
            `}
            </script>

            <section id="troubleshooting" className="section">
                <h2>Troubleshooting</h2>
                <h3>Performance Issues</h3>
                <ul>
                    <li>Restart the laptop.</li>
                    <li>Close unnecessary programs and files.</li>
                    <li>Check for updates for the system and drivers.</li>
                </ul>
            </section>

            <section id="h20-sites" className="section">
                <div className="h20-links-container">
                    <Link href="https://h2o0o0o.github.io/" className="h20-link" target="_blank">Go to my friend site</Link>
                    <Link href="https://isaacdeve.github.io/" className="h20-link" target="_blank">Go to Uvolenь site</Link>
                </div>
            </section>

            <section id="Better API" className="section">
                <h2>Better API</h2>
                <h3>Does not have any trojans</h3>
            </section>
        </>
    )
}