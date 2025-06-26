import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { CircleDollarSign, ExternalLink } from 'lucide-react';

const BuyToken: FC = () => {
  const dexLink = "https://quickswap.exchange/#/swap?outputCurrency=0xYOUR_TOKEN_ADDRESS"; // Replace with actual address

  return (
    <SectionCard title="Buy ECOHO Token" icon={<CircleDollarSign className="text-primary h-8 w-8" />}>
      <p className="mb-4 text-lg">
        Acquire ECOHO tokens easily and securely on a leading decentralized exchange on the Polygon network.
      </p>
      <p className="mb-6 text-xs text-muted-foreground">
        Transactions on the Polygon network are known for being fast and having very low gas fees.
      </p>
      <ButtonLink
        href={dexLink}
        target="_blank"
        rel="noopener noreferrer"
        variant="default"
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        icon={<ExternalLink size={20} />}
      >
        Buy ECOHO on a DEX
      </ButtonLink>
    </SectionCard>
  );
};

export default BuyToken;
