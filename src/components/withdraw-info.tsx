
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Banknote, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WithdrawInfo: FC = () => {
  const steps = [
    {
      title: "Step 1: Use a Decentralized Exchange (DEX)",
      description: "Go to a DEX like PancakeSwap where ECOHO is traded. You will need to connect your personal crypto wallet (e.g., MetaMask, Trust Wallet)."
    },
    {
      title: "Step 2: Swap ECOHO for a Major Cryptocurrency",
      description: "Swap your ECOHO tokens for a more widely accepted cryptocurrency like BNB or a stablecoin (e.g., USDT, BUSD). This requires a liquidity pool to be available."
    },
    {
      title: "Step 3: Send to a Centralized Exchange (CEX)",
      description: "Transfer the BNB or stablecoin from your personal wallet to an account on a centralized exchange that supports your local currency (e.g., Binance, Luno, VALR, Coinbase)."
    },
    {
      title: "Step 4: Sell for Fiat Currency",
      description: "On the centralized exchange, sell the cryptocurrency you received for your local currency (like USD, EUR, ZAR, etc.)."
    },
    {
      title: "Step 5: Withdraw to Your Bank Account",
      description: "Finally, withdraw the funds from your centralized exchange account directly to your bank account."
    }
  ];

  return (
    <SectionCard title="How to Withdraw Funds" icon={<Banknote className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Converting your ECOHO tokens back into traditional currency (like USD or ZAR) involves a few steps using standard cryptocurrency exchanges. Here is a general guide.
      </p>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              {index + 1}
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{step.title}</h3>
              <p className="text-card-foreground/80 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Alert variant="destructive" className="mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Disclaimer</AlertTitle>
        <AlertDescription>
          This guide is for informational purposes only. You are responsible for your own funds and transactions. Cryptocurrency values are volatile and involve risk. Always use official websites for exchanges and be cautious of scams. Ecoho Gold is not responsible for any losses.
        </AlertDescription>
      </Alert>
    </SectionCard>
  );
};

export default WithdrawInfo;
