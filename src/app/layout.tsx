import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerAuthSession } from "@/lib/auth/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CardFlip — trade original creature cards",
  description:
    "CardFlip is a two-sided marketplace for creators trading original creature cards. We support listings, messaging, and protected Checkout with a small platform fee.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] antialiased`}
      >
        <Providers session={session}>
          <div className="relative flex min-h-screen flex-col">
            <span
              aria-hidden
              className="floating-orb left-[10%] top-24 h-56 w-56 bg-[var(--color-accent)]/45"
            />
            <span
              aria-hidden
              className="floating-orb right-[5%] top-1/2 h-64 w-64 bg-[var(--color-accent-strong)]/35"
            />
            <SiteHeader session={session} />
            <main className="relative flex-1 pb-16 pt-10 sm:pt-16">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
