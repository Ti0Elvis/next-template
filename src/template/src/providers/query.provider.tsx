"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

interface Props {
  children: React.ReactNode;
}

export function QueryProvider({ children }: Readonly<Props>) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
