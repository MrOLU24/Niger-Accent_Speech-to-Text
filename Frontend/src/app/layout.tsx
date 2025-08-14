import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "ToriType | Nigerian Speech-to-Text AI Platform",
  description: "Convert Nigerian English and Pidgin speech to text with ToriType's specialized AI model.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="font-sans antialiased bg-[#0e0f16] text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          storageKey="toritype-theme"
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}