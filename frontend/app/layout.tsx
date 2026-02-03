import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/variables.css";
import "../styles/globals.css";
import "../styles/layout.css";
import "../styles/components.css";
import "../styles/auth.css";
import "../styles/admin.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SmoothScroll from "../components/layout/SmoothScroll";
import FloatingButtons from "../components/layout/FloatingButtons";
import { ThemeProvider } from "../contexts/ThemeContext";
import { StoreProvider } from "../lib/store/StoreProvider";
import ToastContainer from "../components/ui/ToastContainer";

// Optimized font loading using next/font
// This automaticallysubsets the font and serves it from your domain
// with optimal caching and font-display: swap
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    // Only load the weights we actually use
    weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
    title: {
        template: '%s | Fortune Tech',
        default: 'Fortune Tech - Premium IT Consulting & Development',
    },
    description: "Transform your business with cutting-edge technology solutions. We build premium web and mobile experiences that drive growth and deliver results.",
    keywords: ["IT Consulting", "Web Development", "Mobile App", "UI/UX Design", "Next.js", "React", "Software Development"],
    authors: [{ name: "Fortune Tech" }],
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Fortune Tech",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var theme = localStorage.getItem('theme');
                                    if (!theme) theme = 'light';
                                    document.documentElement.setAttribute('data-theme', theme);
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
            </head>
            <body className={inter.className}>
                <StoreProvider>
                    <ThemeProvider>
                        <SmoothScroll />
                        <FloatingButtons />
                        <ToastContainer />
                        <Navbar />
                        <main style={{ minHeight: '100vh' }}>
                            {children}
                        </main>
                        <Footer />
                    </ThemeProvider>
                </StoreProvider>
            </body>
        </html>
    );
}

