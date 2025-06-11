import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Gift, Send } from 'lucide-react';

const AirdropRewards: FC = () => {
  const telegramLink = "https://t.me/ecoho_gold_chat";

  return (
    <SectionCard title="Airdrop & Rewards" icon={<Gift className="text-primary h-8 w-8" />}>
      <p className="mb-4 text-lg">
        Join our vibrant community and get rewarded! Hold our NFTs or actively support Ecoho Gold to receive free token airdrops.
      </p>
      <p className="mb-6 text-muted-foreground">
        Airdrop eligibility and announcements are made through our official Telegram group. Don't miss out!
      </p>
      <ButtonLink
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        variant="outline"
        size="lg"
        className="border-primary text-primary hover:bg-primary/10"
        icon={<Send size={20} />}
      >
        Join Telegram Community
      </ButtonLink>
    </SectionCard>
  );
};

export default AirdropRewards;
