import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { CircleDollarSign, ExternalLink } from 'lucide-react';

const BuyToken: FC = () => {
  const pancakeSwapLink = "https://pancakeswap.finance/swap?outputCurrency=0xYOUR_TOKEN_ADDRESS"; // Replace with actual address

  return (
    <SectionCard title="Buy ECOHO Token" icon={<CircleDollarSign className="text-primary h-8 w-8" />}>
      <p className="mb-4 text-lg">
        Acquire ECOHO tokens easily and securely on PancakeSwap, the leading decentralized exchange on Binance Smart Chain.
      </p>
      <p className="mb-6 text-xs text-muted-foreground">
        Transactions on Binance Smart Chain, like those on PancakeSwap, generally benefit from low gas fees compared to some other blockchains.
      </p>
      <ButtonLink
        href={pancakeSwapLink}
        target="_blank"
        rel="noopener noreferrer"
        variant="default"
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        icon={<ExternalLink size={20} />}
      >
        Buy ECOHO on PancakeSwap
      </ButtonLink>
    </SectionCard>
  );
};

export default BuyToken;
