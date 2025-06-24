import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Radio } from 'lucide-react';

const RadioPlayer: FC = () => {
  return (
    <SectionCard title="Ecoho Gold Radio" icon={<Radio className="text-primary h-8 w-8" />}>
      <p className="mb-4 text-lg">
        Tune in to our official radio stream for exclusive music, artist interviews, and community updates.
      </p>
      <iframe
        src="https://link.radioking.com/tsebe-0190"
        width="100%"
        height="150"
        frameBorder="0"
        allow="autoplay"
        style={{ borderRadius: '12px' }}>
      </iframe>
    </SectionCard>
  );
};

export default RadioPlayer;
