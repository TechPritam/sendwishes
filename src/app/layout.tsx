import type { Metadata } from "next";
import "./globals.css";
import { FloatingHearts } from "@/components/FloatingHearts";
import { playfair, greatVibes, inter } from "./fonts";

export const metadata: Metadata = {
  title: "SendWishes — A digital gift made with heart",
  description:
    "A romantic digital gift platform for crafting and sharing heartfelt surprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${greatVibes.variable} ${inter.variable} font-sans antialiased min-h-dvh bg-gradient-to-b from-rose-50 via-pink-50 to-white`}
      >
        <div className="relative min-h-dvh">
          <FloatingHearts />
          <div className="relative">{children}</div>
        </div>
      </body>
    </html>
  );
}