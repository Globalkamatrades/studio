
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Web3Provider } from '@/providers/web3-provider';

export const metadata: Metadata = {
  title: 'Ecoho Gold (ECOHO)',
  description: "Ecoho Gold is Africa's first commodity-backed cryptocurrency powered by gold, platinum, uranium, and oil. Built on the Ethereum Network.",
  verification: {
    google: "9TOOqs1532qYe39Y6XjD9tXxpPclVBd9-HiEeqU_dC4",
    other: {
      "zoho-verification": "zb78072665.zmverify.zoho.com",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Web3Provider>
          {gaId && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              />
              <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}');
                  `,
                }}
              />
            </>
          )}
          {children}
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}
