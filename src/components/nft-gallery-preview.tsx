import type { FC } from 'react';
import Image from 'next/image';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Gem, Sparkles, ArrowRight } from 'lucide-react';

const previewNfts = [
  {
    id: 1,
    name: "Ecoho Genesis",
    imageUrl: "https://placehold.co/300x300.png",
    dataAiHint: "gold abstract",
  },
  {
    id: 2,
    name: "African Beats",
    imageUrl: "https://placehold.co/300x300.png",
    dataAiHint: "music rhythm",
  },
  {
    id: 3,
    name: "Uranium Art",
    imageUrl: "https://placehold.co/300x300.png",
    dataAiHint: "energy glow",
  },
];

const NftGalleryPreview: FC = () => {
  return (
    <SectionCard title="Featured NFTs" icon={<Sparkles className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Discover unique digital collectibles from Ecoho Gold. Each NFT is more than art – it's a piece of our vision.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {previewNfts.map((nft) => (
          <div key={nft.id} className="group rounded-lg overflow-hidden shadow-md border border-border hover:shadow-xl transition-shadow">
            <div className="aspect-square w-full overflow-hidden">
              <Image
                src={nft.imageUrl}
                alt={nft.name}
                width={300}
                height={300}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={nft.dataAiHint}
              />
            </div>
            <div className="p-4 bg-card">
              <h3 className="font-semibold text-card-foreground">{nft.name}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <ButtonLink
          href="/nfts"
          variant="default"
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          icon={<Gem size={20} />}
        >
          Explore Full NFT Gallery <ArrowRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform"/>
        </ButtonLink>
      </div>
    </SectionCard>
  );
};

export default NftGalleryPreview;
