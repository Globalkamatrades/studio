
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Coins, ListChecks, ShieldCheck, ShoppingCart, Users, FileSignature, Droplet, CalendarDays } from 'lucide-react';

interface TokenDetailProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  isAddress?: boolean;
}

const TokenDetailItem: FC<TokenDetailProps> = ({ label, value, icon, isAddress }) => (
  <li className="flex items-start space-x-3 py-3 border-b border-border last:border-b-0">
    <span className="flex-shrink-0 text-primary pt-1">{icon}</span>
    <div>
      <strong className="block text-card-foreground">{label}:</strong>
      {isAddress ? (
        <span className="text-card-foreground/80 font-mono break-all">{value}</span>
      ) : (
        <span className="text-card-foreground/80">{value}</span>
      )}
    </div>
  </li>
);

const TokenInfo: FC = () => {
  const tokenDetails = [
    { label: "Token Name", value: "Ecoho Gold", icon: <Coins size={20} /> },
    { label: "Symbol", value: "ECOHO", icon: <ShieldCheck size={20} /> },
    { label: "Chain", value: "Binance Smart Chain (BEP-20)", icon: <ListChecks size={20} /> },
    { label: "Total Supply", value: "1,000,000,000 ECOHO", icon: <ShoppingCart size={20} /> },
    { label: "Circulating Supply", value: "400,000,000 ECOHO", icon: <Users size={20} /> }, // Updated: 40% of 1B
    { label: "Initial Liquidity", value: "$20 BNB equivalent", icon: <Droplet size={20} /> }, // Updated
    { label: "Planned Launch", value: "Q2 2025", icon: <CalendarDays size={20} /> },
    { label: "Contract Address", value: "To be announced after deployment", icon: <FileSignature size={20} />, isAddress: true }, // Updated
    { label: "Utility", value: "Staking, governance, music NFTs, green projects, DeFi yield", icon: <ListChecks size={20} /> }, // Updated
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
