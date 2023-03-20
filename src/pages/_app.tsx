import { AppBar } from "@/components/parts/AppBar";
import { AppHeader } from "@/components/parts/AppHeader";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Image from "next/image";
import { AuthProvider } from "../auth/AuthProvider";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="w-full">
        <AppBar />
      </div>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
