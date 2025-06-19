
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Users, Send } from 'lucide-react';

const CommunityHub: FC = () => {
  const telegramLink = "https://t.me/ecoho_gold_chat";

  return (
    <SectionCard title="Join the Ecoho Gold Community" icon={<Users className="text-primary h-8 w-8" />}>
      <p className="mb-4 text-lg">
        Connect with fellow enthusiasts, stay updated on the latest project news, and participate in discussions.
      </p>
      <p className="mb-6 text-muted-foreground">
        All official announcements, news, and community events are shared in our Telegram group. Join us to be part of the conversation!
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

export default CommunityHub;
