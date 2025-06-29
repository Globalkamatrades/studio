import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Store, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const BuyToken: FC = () => {
  const exchangeLinks = [
    {
      name: "Uniswap (DEX)",
      href: "https://app.uniswap.org/swap?outputCurrency=YOUR_ERC20_TOKEN_ADDRESS_HERE", // Replace with actual address
      description: "Trade ECOHO directly from your wallet on the Ethereum network's leading DEX.",
      icon: "https://placehold.co/40x40.png" // Placeholder for Uniswap logo
    },
    // More exchanges can be added here later
  ];

  return (
    <SectionCard title="Buy ECOHO on Uniswap" icon={<Store className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Acquire ECOHO tokens on Uniswap, the leading decentralized exchange on the Ethereum network.
      </p>
      
      <div className="space-y-4">
        {exchangeLinks.map((link) => (
          <div key={link.name} className="p-4 border rounded-lg bg-card/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
               <Image src={link.icon} alt="Uniswap Logo" width={40} height={40} data-ai-hint="uniswap logo" />
              <div>
                <h3 className="font-semibold text-card-foreground">{link.name}</h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
            </div>
            <ButtonLink
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="default"
              size="default"
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0"
              icon={<ExternalLink size={18} />}
            >
              Go to Uniswap
            </ButtonLink>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        You will need a wallet compatible with the Ethereum Network (like MetaMask or Trust Wallet) and some ETH for transaction fees.
      </p>
    </SectionCard>
  );
};

export default BuyToken;
