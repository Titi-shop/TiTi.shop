
import "./globals.css";
import Script from "next/script";
import PiRootClient from "./PiRootClient";
import { AuthProvider } from "@/context/AuthContext";
import AlertProvider from "@/app/components/AlertProvider";
import { SWRConfig } from "swr";
import ThemeProvider from "@/components/ThemeProvider";
import type { Metadata } from "next";
import ChatButton from "@/components/chat/ChatButton";
export const metadata: Metadata = {
  metadataBase: new URL(
    "https://muasam.titi.onl"
  ),

  title: {
    default: "TiTi Shop",
    template: "%s | TiTi Shop",
  },

  description:
    "Pi Network Marketplace",

  applicationName:
    "TiTi Shop",

  keywords: [
    "Pi Network",
    "TiTi Shop",
    "Marketplace",
    "Pi Commerce",
  ],

  openGraph: {
    title:
      "TiTi Shop",

    description:
      "Pi Network Marketplace",

    siteName:
      "TiTi Shop",

    type:
      "website",

    images: [
      {
        url:
          "/banners/3D035BE4-0822-403D-9631-6C4CF674A519.png",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "TiTi Shop",

    description:
      "Pi Network Marketplace",

    images: [
      "/banners/3D035BE4-0822-403D-9631-6C4CF674A519.png",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
  lang="en"
  suppressHydrationWarning
>
      <head>
        <link rel="preload" as="image" href="/avatar.png" />
        <link rel="preload" as="image" href="/banners/default-shop.png" />

        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="afterInteractive"
        />

        {/* đŸ”¥ FIX: trĂ¡nh FOUC (nhĂ¡y theme khi load) */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                const mode =
              localStorage.getItem("theme-mode") || "light";

              const root =
              document.documentElement;

              root.classList.remove(
                "theme-light",
                "theme-dark"
              );

              root.classList.add(
                mode === "dark"
                  ? "theme-dark"
                  : "theme-light"
              );
              } catch (e) {}
            })();
          `}
        </Script>
      </head>

      <body>
  <SWRConfig
    value={{
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      shouldRetryOnError: false,
    }}
  >
    <AlertProvider />

    <AuthProvider>
      <ThemeProvider>
        <PiRootClient>
          {children}
        </PiRootClient>

        <ChatButton />
      </ThemeProvider>
    </AuthProvider>
  </SWRConfig>
</body>
    </html>
  );
}




