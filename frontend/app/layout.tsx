import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AdSpot Manager",
  description: "Gestión de Ad Spots",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-gray-50 text-gray-900 antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
