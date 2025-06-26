
import type { FC, ReactNode } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Coins, ListChecks, ShieldCheck, ShoppingCart, Users, FileSignature, Droplet, CalendarDays } from 'lucide-react';

interface TokenDetailProps {
  label: string;
  value: ReactNode;
  icon: React.ReactNode;
}

const TokenDetailItem: FC<TokenDetailProps> = ({ label, value, icon }) => (
  <li className="flex items-start space-x-3 py-3 border-b border-border last:border-b-0">
    <span className="flex-shrink-0 text-primary pt-1">{icon}</span>
    <div>
      <strong className="block text-card-foreground">{label}:</strong>
      <div className="text-card-foreground/80">{value}</div>
    </div>
  </li>
);

const TokenInfo: FC = () => {
  const tokenDetails: TokenDetailProps[] = [
    { label: "Token Name", value: "Ecoho Gold", icon: <Coins size={20} /> },
    { label: "Symbol", value: "ECOHO", icon: <ShieldCheck size={20} /> },
    { label: "Chain", value: "Polygon (ERC-20)", icon: <ListChecks size={20} /> },
    { label: "Total Supply", value: "1,000,000,000 ECOHO", icon: <ShoppingCart size={20} /> },
    { label: "Circulating Supply", value: "400,000,000 ECOHO", icon: <Users size={20} /> },
    { label: "Initial Liquidity", value: "$20 MATIC equivalent", icon: <Droplet size={20} /> },
    { label: "Planned Launch", value: "Q2 2025", icon: <CalendarDays size={20} /> },
    { 
      label: "Contract Address", 
      value: <span className="font-mono break-all">To be announced after deployment</span>, 
      icon: <FileSignature size={20} /> 
    },
    { 
      label: "Utility", 
      value: (
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Staking for rewards</li>
          <li>Governance & voting rights</li>
          <li>Purchasing Music NFTs</li>
          <li>Investing in eco-friendly projects</li>
          <li>General DeFi yield opportunities</li>
        </ul>
      ), 
      icon: <ListChecks size={20} /> 
    },
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
