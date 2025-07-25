import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { QueryProvider } from "@/providers/query.provider";
import { ThemeProvider } from "@/providers/theme.provider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Untitled",
};

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <QueryProvider>
            <main className="w-full min-h-[calc(100vh-4rem)]">{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
