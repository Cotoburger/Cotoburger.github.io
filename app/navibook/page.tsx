import Image from "next/image";
import MainPic from "@/public/mainpic.png"
import MobilePic from "@/public/mobilepic.png"
import {StaticImport} from "next/dist/shared/lib/get-img-props";

export default function Home() {
    return (
        <>
            {/*Используем локальное изображение для мобильных устройств и для десктопов*/}
            <Image className="large-image mobile-image" src={MobilePic as StaticImport} alt="Mobile Image" quality={100}/>
            <Image className="large-image desktop-image" src={MainPic as StaticImport} alt="Desktop Image" quality={100}/>

            <div className="container">

                <section id="overview" className="section">
                    <h2>Overview</h2>
                    <p>NaviBook is the most advanced mod-free laptop for playing Scrap Mechanic, combining a
                        compact design with powerful capabilities that are unattainable for most other
                        full-sized builds in the game.</p>
                </section>

                <section id="specs" className="section">
                    <h2>Specifications</h2>
                    <ul>
                        <li><strong>CPU:</strong> Taylor Processing Unit 3</li>
                        <li><strong>RAM:</strong> 20bit</li>
                        <li><strong>Hard Drive:</strong> Timer Drive 20bit</li>
                        <li><strong>Screen:</strong> 5x3, Quad HD</li>
                        <li><strong>OS:</strong> Navi OS 2</li>
                    </ul>
                </section>

                <section id="maintenance" className="section">
                    <h2>Maintenance</h2>
                    <ul>
                        <li>Regularly clean the screen from dust and stains using a soft cloth.</li>
                        <li>Do not overload the system; close unnecessary programs to improve performance.</li>
                        <li>Use antivirus software to protect the device.</li>
                        <li>Monitor battery levels and avoid deep discharges.</li>
                    </ul>
                </section>

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
                        <a href="https://h2o0o0o.github.io/" className="h20-link" target="_blank">Go to my friend
                            site</a>
                        <a href="https://isaacdeve.github.io/" className="h20-link" target="_blank">Go to Uvolenь
                            site</a>
                    </div>
                </section>
                <section id="Better API" className="section">
                    <h2>Better API</h2>
                    <h3>Does not have any trojans</h3>
                </section>
            </div>
        </>
    );
}
