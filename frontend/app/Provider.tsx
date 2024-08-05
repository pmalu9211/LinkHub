"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { RecoilRoot } from "recoil";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </RecoilRoot>
  );
}
