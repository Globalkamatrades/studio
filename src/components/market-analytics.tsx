import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { LineChart, TrendingUp, DollarSign, Info, ExternalLink, Users, Coins, FileSignature } from 'lucide-react';
import ButtonLink from './ui/button-link';
import MarketPriceChart from './charts/market-price-chart';
import TokenDistributionChart from './charts/token-distribution-chart';

interface MarketStatProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  valueClassName?: string;
}

const MarketStat: FC<MarketStatProps> = ({ label, value, subValue, icon, valueClassName }) => {
  return (
    <div className="p-4 bg-card/50 rounded-lg shadow-inner">
      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className={`text-2xl font-semibold text-primary mt-1 ${valueClassName}`}>
        {value}
      </p>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </div>
  );
};

const MarketAnalytics: FC = () => {
  // Static data inspired by Token Terminal and consistent with app's token-info
  const price = "$0.01";
  const priceChange = "+2.17%";
  const marketCap = "N/A"; 
  const circulatingSupply = "400,000,000 ECOHO"; // Consistent with token-info.tsx
  const totalSupply = "1,000,000,000 ECOHO"; // Consistent with token-info.tsx
  const contractAddressPartial = "0x...a82b"; // Placeholder style from screenshot

  // Placeholder link - update when full contract address is available
  const explorerLink = `https://etherscan.io/token/YOUR_ECOHO_CONTRACT_ADDRESS_HERE`;


  return (
    <SectionCard
      title="ECOHO Market Snapshot"
      icon={<LineChart className="text-primary h-8 w-8" />}
      actions={
        <ButtonLink
          href={explorerLink} 
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="sm"
          className="text-xs"
          icon={<ExternalLink size={14} />}
          title="View on a token explorer (e.g., Etherscan). Needs full contract address."
        >
          View on Explorer
        </ButtonLink>
      }
    >
      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 text-blue-700 rounded-md text-sm flex items-center gap-2">
        <Info size={18} />
        <span>Data displayed is illustrative. Real-time data will be available from exchanges upon listing.</span>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <MarketPriceChart />
        <TokenDistributionChart />
      </div>

      <div className="flex items-baseline gap-2 mb-6">
        <p className="text-4xl font-bold text-foreground">{price}</p>
        <p className="text-lg font-semibold text-green-500 flex items-center">
          <TrendingUp size={20} className="mr-1" /> {priceChange}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MarketStat
          label="Market Cap"
          value={marketCap}
          icon={<DollarSign size={16} className="text-muted-foreground" />}
        />
        <MarketStat
          label="Circulating Supply"
          value={circulatingSupply}
          icon={<Users size={16} className="text-muted-foreground" />}
        />
        <MarketStat
          label="Total Supply"
          value={totalSupply}
          icon={<Coins size={16} className="text-muted-foreground" />}
        />
        <MarketStat
          label="Contract Address"
          value={contractAddressPartial}
          icon={<FileSignature size={16} className="text-muted-foreground" />}
          valueClassName="text-sm font-mono"
        />
      </div>
       <p className="text-xs text-muted-foreground mt-4 text-right">
        For detailed and real-time information, please refer to official exchanges or explorers once the full contract address is integrated.
      </p>
    </SectionCard>
  );
};

export default MarketAnalytics;
