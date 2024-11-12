import type {Metadata} from "next";
import "./styles.css";

export const metadata: Metadata = {
    title: "Catsburger",
    description: "Web Page",
    openGraph: {
        title: "Catsburger",
        description: "Web Page",
        images: ["https://cotoburger.github.io/avatar.png"],
    },
    twitter: {
        title: "Catsburger",
        description: "Web Page",
        images: ["https://cotoburger.github.io/avatar.png"],
    },
    icons: ["/avatar.png"],
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
        <body
            className={`antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
