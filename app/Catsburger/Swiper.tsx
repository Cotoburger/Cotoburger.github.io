import { StaticImport } from "next/dist/shared/lib/get-img-props";
import {Swiper as LSwiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import {Autoplay} from "swiper/modules";

export interface ImageSwipe {
    url: string;
    image: StaticImport;
}

export default function SwiperComponent({ images }: { images: ImageSwipe[] }) {
    return (
        <div className="w-full h-full">
            <LSwiper
                modules={[Autoplay]} // Add Autoplay module
                spaceBetween={50} // space between slides
                slidesPerView={1} // number of slides to show at once
                navigation // add navigation buttons
                pagination={{ clickable: true }} // add pagination
                loop // loop slides
                autoplay={{
                    delay: 3000, // slide every 3 seconds
                    disableOnInteraction: false, // continue autoplay even after user interacts with the slider
                }}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Link href={image.url} className="flex place-content-center">
                            <Image src={image.image} alt={index.toString()}/>
                        </Link>
                    </SwiperSlide>
                ))}
            </LSwiper>
        </div>
    );
}
