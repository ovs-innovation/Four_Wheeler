import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "4Pahia - Admin Dashboard",
  description: "Administrative dashboard for 4Pahia marketplace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-slate-900 text-slate-100 flex flex-col`}
      >
        <AdminAuthProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Toaster position="top-right" />
        </AdminAuthProvider>
      </body>
    </html>
  );
}
