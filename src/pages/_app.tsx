import { AppHeader } from "@/components/parts/AppHeader";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { AuthProvider } from "../auth/AuthProvider";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AppHeader />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
