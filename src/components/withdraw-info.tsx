
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Banknote, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WithdrawInfo: FC = () => {
  const steps = [
    {
      title: "Step 1: Log into Your Exchange Account",
      description: "Sign in to the centralized exchange (e.g., Bybit, KuCoin) where you hold your ECOHO tokens."
    },
    {
      title: "Step 2: Sell ECOHO for Fiat Currency",
      description: "Navigate to the trading section and sell your ECOHO tokens for your local currency (like USD, EUR, ZAR, etc.)."
    },
    {
      title: "Step 3: Withdraw to Your Bank Account",
      description: "Go to your fiat wallet on the exchange and initiate a withdrawal to your linked bank account."
    }
  ];

  return (
    <SectionCard title="How to Withdraw Funds" icon={<Banknote className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Ready to turn your ECOHO tokens back into cash? With centralized exchanges, it's a simple and secure process.
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

      <Alert variant="default" className="mt-8 bg-blue-900/20 border-blue-500/30 text-blue-300">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertTitle className="text-blue-300">Important Information</AlertTitle>
        <AlertDescription className="text-blue-400/90">
          This guide assumes ECOHO is listed on a centralized exchange and you hold your tokens there. You are responsible for your own funds and transactions. Always use official exchange websites and enable two-factor authentication (2FA) for security.
        </AlertDescription>
      </Alert>
    </SectionCard>
  );
};

export default WithdrawInfo;
