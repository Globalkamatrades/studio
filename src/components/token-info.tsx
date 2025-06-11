import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Coins, ListChecks, ShieldCheck, ShoppingCart } from 'lucide-react';

interface TokenDetailProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const TokenDetailItem: FC<TokenDetailProps> = ({ label, value, icon }) => (
  <li className="flex items-start space-x-3 py-3 border-b border-border last:border-b-0">
    <span className="flex-shrink-0 text-primary pt-1">{icon}</span>
    <div>
      <strong className="block text-card-foreground">{label}:</strong>
      <span className="text-card-foreground/80">{value}</span>
    </div>
  </li>
);

const TokenInfo: FC = () => {
  const tokenDetails = [
    { label: "Token Name", value: "Ecoho Gold", icon: <Coins size={20} /> },
    { label: "Symbol", value: "ECOHO", icon: <ShieldCheck size={20} /> },
    { label: "Chain", value: "Binance Smart Chain (BEP-20)", icon: <ListChecks size={20} /> },
    { label: "Total Supply", value: "100,000,000 ECOHO", icon: <ShoppingCart size={20} /> },
    { label: "Utility", value: "Eco-projects, NFT rewards, cross-border trade", icon: <ListChecks size={20} /> },
  ];

  return (
    <SectionCard title="About the ECOHO Token" icon={<Coins className="text-primary h-8 w-8" />}>
      <ul className="space-y-2">
        {tokenDetails.map((detail) => (
          <TokenDetailItem key={detail.label} {...detail} />
        ))}
      </ul>
    </SectionCard>
  );
};

export default TokenInfo;
