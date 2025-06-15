
import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import { Music2 } from 'lucide-react';

const SpotifyPlayer: FC = () => {
  const artistId = "0SKtNTddZSa7jYW84C6CSL"; // Extracted from the provided Spotify artist link

  return (
    <SectionCard title="Listen on Spotify" icon={<Music2 className="text-primary h-8 w-8" />}>
      <div className="overflow-hidden rounded-lg shadow-inner">
        <iframe
          style={{ borderRadius: "12px" }}
          src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator`}
          width="100%"
          height="352" // Common height for Spotify artist embed
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="border-none"
        ></iframe>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Explore the artist's top tracks and albums on Spotify.
      </p>
    </SectionCard>
  );
};

export default SpotifyPlayer;
