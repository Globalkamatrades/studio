
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Store, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const BuyToken: FC = () => {
  const exchangeLinks = [
    {
      name: "Bybit (Centralized Exchange)",
      href: "https://www.bybit.com",
      description: "A leading global exchange, ideal for secure and fast transactions.",
      icon: "https://placehold.co/40x40.png",
      dataAiHint: "bybit logo",
      status: "Listing Planned"
    },
    {
      name: "KuCoin (Centralized Exchange)",
      href: "https://www.kucoin.com",
      description: "Known as 'The People's Exchange', offering a wide range of assets.",
      icon: "https://placehold.co/40x40.png",
      dataAiHint: "kucoin logo",
      status: "Listing Planned"
    },
  ];

  return (
    <SectionCard title="How to Buy ECOHO" icon={<Store className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        ECOHO will be available for purchase on major centralized exchanges (CEXs). This ensures a secure and user-friendly experience for our community.
      </p>
      
      <div className="space-y-4">
        {exchangeLinks.map((link) => (
          <div key={link.name} className="p-4 border rounded-lg bg-card/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
               <Image src={link.icon} alt={`${link.name} Logo`} width={40} height={40} data-ai-hint={link.dataAiHint} />
              <div>
                <h3 className="font-semibold text-card-foreground">{link.name}</h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0">
                <Badge variant="secondary">{link.status}</Badge>
                <ButtonLink
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="default"
                size="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 w-full sm:w-auto"
                icon={<ExternalLink size={18} />}
                >
                Visit Exchange
                </ButtonLink>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        You will need to create an account on one of the exchanges above to buy, sell, and trade ECOHO once it is listed.
      </p>
    </SectionCard>
  );
};

export default BuyToken;
