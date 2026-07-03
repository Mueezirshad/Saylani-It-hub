import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Saylani Mass IT Hub",
  description: "Multi-functional student and staff campus portal",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        {/* Top Navbar */}
        <Navbar />
        
        {/* Main Content Body */}
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="bg-white border-t border-gray-200 text-center py-4 text-sm text-gray-500 mt-auto">
          © 2026 Saylani Mass IT Hub. All Rights Reserved.
        </footer>
      </body>
    </html>
  );
}
