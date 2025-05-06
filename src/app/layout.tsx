import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Naturale - Fizika kroz realne primere",
    template: "%s | Naturale"
  },
  description: "Naturale je projekat koji učenicima približava fiziku kroz realne primere i interaktivna predavanja.",
  keywords: ["fizika", "obrazovanje", "nauka", "prirodne nauke", "škola", "učenje", "predavanja"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
