"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children, session }: { children: ReactNode; session?: Session | null }) {
  const [client] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={client}>
          {children}
          <Toaster position="bottom-center" />
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
