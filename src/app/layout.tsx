import { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Sonehra Wellness - Fee Management Portal",
  description: "Professional fee receipt management system for Sonehra Wellness, Faridabad",
  authors: [{ name: "Sonehra Wellness" }],
  keywords: ["school management", "fee management", "receipt system", "Sonehra Wellness"],
  openGraph: {
    title: "Sonehra Wellness - Fee Management Portal",
    description: "Professional fee receipt management system",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
