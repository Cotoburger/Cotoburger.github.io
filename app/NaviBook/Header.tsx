"use client"

import {usePathname} from "next/navigation";
import Link from "next/link";

const names = {
    "/NaviBook": "Home",
    "/NaviBook/about": "Guide",
    "/NaviBook/dev": "Dev",
}

export default function Header() {
    const pathname = usePathname()
    return (
        <>
            <header>
                {/*// @ts-expect-error*/}
                <h1>NaviBook|{names[pathname]}</h1>
            </header>

            <nav className="flex place-content-center gap-4">
                <Link href="/NaviBook">Home</Link>
                <Link href="/NaviBook/about">Guide</Link>
                <Link href="/NaviBook/dev">Development</Link>
            </nav>
        </>
    )
}