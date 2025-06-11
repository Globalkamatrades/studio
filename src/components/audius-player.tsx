import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Music2 } from 'lucide-react';

const AudiusPlayer: FC = () => {
  const trackId = "YOUR_TRACK_ID"; // Replace with actual track ID or make it a prop

  return (
    <SectionCard title="Listen to the Music" icon={<Music2 className="text-primary h-8 w-8" />}>
      <div className="aspect-video md:aspect-[16/5] overflow-hidden rounded-lg shadow-inner">
        <iframe
          src={`https://audius.co/embed/track/${trackId}`}
          width="100%"
          height="100%" // Adjusted to fill container
          allow="encrypted-media"
          className="border-none"
          loading="lazy"
        ></iframe>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Immerse yourself in the sounds of Ecoho.
      </p>
    </SectionCard>
  );
};

export default AudiusPlayer;
