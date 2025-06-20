import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecoho Gold Commercial Invoice',
  description: 'Commercial invoice for Ecoho Gold transactions.',
};

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Minimal head content for the invoice page */}
        {/* The main app's global CSS is intentionally not imported here 
            to keep invoice styling isolated and clean. */}
      </head>
      <body className="font-['Arial',_sans-serif] m-5 bg-white text-black">
        {children}
      </body>
    </html>
  );
}
```