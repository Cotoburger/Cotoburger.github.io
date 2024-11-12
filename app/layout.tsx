import type {Metadata} from "next";
import "./styles.css";

export const metadata: Metadata = {
    title: "Catsburger",
    description: "Web Page",
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
