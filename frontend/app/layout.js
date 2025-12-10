import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import { AuthProvider } from '@/lib/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Ocean Gate International - Stock Management',
    description: 'Live seafood inventory and POS system',
    icons: {
        icon: '/favicon.png',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <Navigation />
                    <main className="container mx-auto px-4 py-6 pt-20">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
