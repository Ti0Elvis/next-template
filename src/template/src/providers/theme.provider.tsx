"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: Readonly<Props>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
