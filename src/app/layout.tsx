import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuxeLayer | Premium Countertop Protection",
  description:
    "Invisible protection for luxury surfaces. LuxeLayer applies premium PPF (Paint Protection Film) to countertops, keeping your investment pristine for years.",
  keywords: [
    "countertop protection",
    "PPF countertop",
    "luxury surface shield",
    "marble protection",
    "quartz protection",
    "granite protection film",
    "countertop scratch protection",
    "premium countertop care",
  ],
  openGraph: {
    title: "LuxeLayer | Premium Countertop Protection",
    description:
      "Invisible protection for luxury surfaces. Premium PPF for countertops.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
