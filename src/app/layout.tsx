import type { Metadata } from "next";
import { Geist, Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMenuItems } from "@/lib/menu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    template: "%s | The Printers (Mysore) Pvt. Ltd.",
    default: "The Printers (Mysore) Pvt. Ltd.",
  },
  description:
    "Publishers of Deccan Herald, Prajavani, Sudha and Mayura — Karnataka's storytellers since 1948.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerItems = await getMenuItems("HEADER");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header items={headerItems} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}