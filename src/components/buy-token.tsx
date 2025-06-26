import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Store, ExternalLink } from 'lucide-react';

const BuyToken: FC = () => {
  // As you get listed on more exchanges, add them to this list.
  const exchangeLinks = [
    {
      name: "Uniswap (DEX)",
      href: "https://app.uniswap.org/#/swap?outputCurrency=0xYOUR_TOKEN_ADDRESS_HERE", // Replace with actual address
      description: "For decentralized trading directly from your wallet."
    },
    {
      name: "Bybit (CEX)",
      href: "https://www.bybit.com/", // Update with the direct trading pair link when available
      description: "A leading centralized exchange for easy trading."
    },
    // Add more exchanges here as you get listed, for example:
    // { name: "Coinbase", href: "https://www.coinbase.com/", description: "..." }
  ];

  return (
    <SectionCard title="Where to Buy ECOHO" icon={<Store className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Acquire ECOHO tokens securely on the following leading exchanges. Choose the platform that works best for you.
      </p>
      
      <div className="space-y-4">
        {exchangeLinks.map((link) => (
          <div key={link.name} className="p-4 border rounded-lg bg-card/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-semibold text-card-foreground">{link.name}</h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </div>
            <ButtonLink
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="default"
              size="default"
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 w-full sm:w-auto"
              icon={<ExternalLink size={18} />}
            >
              Go to {link.name.split(' ')[0]}
            </ButtonLink>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Decentralized Exchanges (DEX) allow you to trade from your own wallet. Centralized Exchanges (CEX) require you to create an account and deposit funds.
      </p>
    </SectionCard>
  );
};

export default BuyToken;