import type { Metadata } from "next";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; 
import "./globals.css";
import { Varela_Round } from 'next/font/google'; 


const varelaRound = Varela_Round({
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-varela-round', // تعريف متغير CSS لاستخدامه في Tailwind
});


export const metadata: Metadata = {
  title: "MASAR ",
  description: "APP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${varelaRound.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}