import { Inter } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import AuthProvider from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CPE SmartParkingLot",
  description: "CPE SmartParkingLot",
  icons: {
    icon: '/icon.ico', // ใส่ path ไปที่ favicon ของคุณ
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <link rel="icon" href="/icon.ico" type="image/x-icon" />
      <title>CPE SmartParkingLot</title>
    </head>
    <body className={inter.className}>  
      <AuthProvider>{children}</AuthProvider>
    </body>
  </html>
  );
}
