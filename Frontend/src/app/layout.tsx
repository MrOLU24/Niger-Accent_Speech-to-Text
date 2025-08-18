import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import SimplePageLoader from "../components/SimplePageLoader";
import ConditionalNavbar from "../components/ConditionalNavbar";

export const metadata: Metadata = {
  title: "ToriType | Nigerian Speech-to-Text AI Platform",
  description: "Convert Nigerian Accent and Pidgin speech to text with ToriType's specialized AI model.",
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
          <SimplePageLoader />
          <ConditionalNavbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}