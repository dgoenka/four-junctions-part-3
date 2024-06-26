import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import "./globals.css";
import Header from "@/common/Header";

const inter = Golos_Text({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "imdB clone",
  description: "Four Junctions Assignment Part Two",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
