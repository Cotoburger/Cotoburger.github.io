"use client"

import React from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";

const pageNames = {
    "/navibook": "Home",
    "/navibook/about": "About",
    "/navibook/dev": "Dev"
}

export default function Header() {
    const pathname = usePathname()
    return (
        <>
            <header>
                <h1>NaviBook|{pageNames[pathname] || "Unknown"}</h1>
            </header>
            <nav>
                <Link href="/navibook">Home</Link>
                <Link href="/navibook/about">Guide</Link>
                <Link href="/navibook/dev">Development</Link>
            </nav>
        </>
    );
}