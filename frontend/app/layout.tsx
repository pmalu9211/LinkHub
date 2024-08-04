import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkHub",
  description: "A platfrom for sharing links with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Navbar />
          {children}
          <Toaster
            richColors
            position="bottom-right"
            toastOptions={{
              style: { background: "" },
              className: "my-toast text-xl",
            }}
          />
        </Provider>
      </body>
    </html>
  );
}
