
"use client";

import type { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const CommercialInvoicePage: NextPage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <header className="bg-black text-white p-2.5 text-center">
        <Image 
          src="https://kamaincprofile.com/logo.png" 
          alt="Ecoho Gold Logo" 
          width={120} 
          height={50} // Assuming a height, adjust if needed
          className="mx-auto mb-2.5" 
        />
        <h1 className="text-2xl font-bold">Ecoho Gold</h1>
        <p>123 Ecoho Lane, Johannesburg, GP, 2000 | www.kamaincprofile.com | Akhona@kamaincprofile.com | 065 533 5608</p>
      </header>

      <main className="border border-gray-300 p-5 mt-5">
        <h2 className="text-xl font-bold mb-4">Commercial Invoice</h2>
        <p>
          <strong>Invoice No.:</strong> 10001<br />
          <strong>Invoice Date:</strong> 2025/06/13<br />
          <strong>Due Date:</strong> 2025/06/20
        </p>

        <div className="font-bold mt-5">Bill To</div>
        <p>Client Name<br />Client Company<br />Client Address<br />Phone</p>

        <div className="font-bold mt-5">Ship To</div>
        <p>Client Name<br />Client Company<br />Client Address<br />Phone</p>

        <table className="w-full border-collapse mt-2.5">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2 text-left bg-gray-100">Description</th>
              <th className="border border-gray-200 p-2 text-left bg-gray-100">Quantity</th>
              <th className="border border-gray-200 p-2 text-left bg-gray-100">Unit Price</th>
              <th className="border border-gray-200 p-2 text-left bg-gray-100">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 p-2 text-left">Item 1 description</td>
              <td className="border border-gray-200 p-2 text-left">1</td>
              <td className="border border-gray-200 p-2 text-left">$150.00</td>
              <td className="border border-gray-200 p-2 text-left">$150.00</td>
            </tr>
            <tr>
              <td className="border border-gray-200 p-2 text-left">Item 2 description</td>
              <td className="border border-gray-200 p-2 text-left">2</td>
              <td className="border border-gray-200 p-2 text-left">$40.00</td>
              <td className="border border-gray-200 p-2 text-left">$80.00</td>
            </tr>
            <tr className="font-bold">
              <td colSpan={3} className="border border-gray-200 p-2 text-left">Shipping</td>
              <td className="border border-gray-200 p-2 text-left">$5.00</td>
            </tr>
            <tr className="font-bold">
              <td colSpan={3} className="border border-gray-200 p-2 text-left">Total</td>
              <td className="border border-gray-200 p-2 text-left">$235.00</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-[30px] bg-gray-100 p-2.5 border border-dashed border-gray-700">
          <strong>Crypto Wallet Address for Payment:</strong><br />
          <code className="font-mono">0xYourWalletAddressHere</code>
          <br /><small className="text-xs">(ECOHO BEP-20 Wallet)</small>
        </div>

        <p className="mt-[30px]">I declare all the information contained in this invoice to be true and correct.</p>
        <p>
          <strong>Shipper:</strong> Akhona Kama<br />
          <strong>Date:</strong> 2025/06/13
        </p>
      </main>

      <div className="mt-5 text-center">
        <Button 
          onClick={handlePrint} 
          className="py-2.5 px-5 bg-primary hover:bg-primary/90 text-primary-foreground border-none"
        >
          Download / Print PDF
        </Button>
      </div>

      <footer className="bg-black text-white p-2.5 text-center mt-5">
        Thank you for your business!
      </footer>
    </>
  );
};

export default CommercialInvoicePage;
