import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Skillswami – Free Fire MAX Tournament Pools",
  description:
    "Join BR Match Solo (Skill On) pools on Skillswami. Sign up, pay entry fee, and compete.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="font-sans">
        <Header user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
