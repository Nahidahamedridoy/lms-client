import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataPollex LMS | Simplified Learning Platform",
  description: "Modern, professional Learning Management System foundation for DataPollex Ltd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
