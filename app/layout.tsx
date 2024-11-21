import type { Metadata } from "next";
import { ThemeProvider } from "@/components/global/theme-provider";
import Head from "next/head";
import Script from "next/script";

import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>My page title</title>
      </Head>

      <body>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/fullpage-vertical-slider@latest/dist/style.css"
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}