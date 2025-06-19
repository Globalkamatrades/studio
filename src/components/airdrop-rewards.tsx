
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Gift, Send } from 'lucide-react'; // Using Gift for rewards

const AirdropRewards: FC = () => {
  const telegramLink = "https://t.me/ecoho_gold_chat"; // Ensure this is your correct Telegram link

  return (
    <SectionCard title="Airdrop & Community Rewards" icon={<Gift className="text-primary h-8 w-8" />}>
      <p className="mb-4 text-lg">
        Get free ECOHO tokens by participating in our airdrops and community events! Stay active and contribute to earn rewards.
      </p>
      <p className="mb-6 text-muted-foreground">
        All official airdrop announcements, reward programs, and community events are shared in our Telegram group. Join us to ensure you don&apos;t miss out!
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
        Join Telegram for Airdrops
      </ButtonLink>
      <p className="mt-4 text-xs text-muted-foreground">
        Terms and conditions apply to all airdrops and reward programs. Token rewards are subject to availability and campaign rules.
      </p>
    </SectionCard>
  );
};

export default AirdropRewards;
