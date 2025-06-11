import type { FC } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Gem, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const NftPurchase: FC = () => {
  const openSeaLink = "https://opensea.io/assets/YOUR_NFT_LINK"; // Replace with actual link

  return (
    <SectionCard title="Buy the Music NFT" icon={<Gem className="text-primary h-8 w-8" />}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Image
          src="https://placehold.co/300x200.png"
          alt="Music NFT"
          width={300}
          height={200}
          className="rounded-lg shadow-md object-cover"
          data-ai-hint="music nft"
        />
        <div className="flex-1">
          <p className="mb-4 text-lg">
            Support the artist and become part of the Ecoho Gold ecosystem by purchasing our exclusive Music NFT.
          </p>
          <p className="mb-6 font-semibold text-primary">
            Each NFT purchase rewards you with 100 ECOHO tokens!
          </p>
          <ButtonLink
            href={openSeaLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            icon={<ExternalLink size={20}/>}
          >
            Buy on OpenSea
          </ButtonLink>
        </div>
      </div>
    </SectionCard>
  );
};

export default NftPurchase;
