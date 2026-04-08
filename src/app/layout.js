import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProtectedRoute from '@/components/ProtectedRoute'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Scoreboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className="min-h-full flex flex-col">
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </body>
    </html>
  );
}
