"use client";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./redux/provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { Session } from "next-auth";

export default function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <Providers>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="discord-theme"
        >
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </ThemeProvider>
      </Providers>
    </SessionProvider>
  );
}
