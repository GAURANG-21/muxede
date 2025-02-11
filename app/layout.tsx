"use client";

import "@/styles/global.css";
import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  console.log("QueryClient:", queryClient, "SessionProvider is initialized");

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <div>
              <Toaster />
            </div>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
