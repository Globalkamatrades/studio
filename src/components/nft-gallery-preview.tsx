
"use client";

import type { FC } from 'react';
import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gem, Sparkles, ArrowRight, Music2, PlayCircle } from 'lucide-react';

interface PreviewNftItem {
  id: string | number;
  name: string;
  imageUrl: string;
  dataAiHint: string;
  musicUrl?: string;
  description?: string;
}

const staticPreviewNfts: PreviewNftItem[] = [
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
  const [musicUrlInput, setMusicUrlInput] = useState('');
  const [musicTitleInput, setMusicTitleInput] = useState('');
  const [userMusicNft, setUserMusicNft] = useState<PreviewNftItem | null>(null);

  const handleUserMusicSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (musicTitleInput.trim() && musicUrlInput.trim()) {
      setUserMusicNft({
        id: 'user-submitted-' + Date.now(),
        name: musicTitleInput,
        imageUrl: 'https://placehold.co/300x300.png',
        dataAiHint: 'custom music audio',
        musicUrl: musicUrlInput,
        description: "User submitted music.",
      });
      // Optionally clear inputs
      // setMusicTitleInput('');
      // setMusicUrlInput('');
    }
  };

  return (
    <SectionCard title="Featured NFTs & Music" icon={<Sparkles className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Discover unique digital collectibles and featured music from Ecoho Gold. Each item is more than art – it's a piece of our vision. You can also feature your own music link below!
      </p>

      {/* Form to add music URL */}
      <form onSubmit={handleUserMusicSubmit} className="my-6 p-4 border-2 border-dashed border-primary/30 rounded-lg shadow-inner bg-card/50 space-y-4">
        <h3 className="text-xl font-headline text-primary mb-3">Feature Your Music Link</h3>
        <div>
          <Label htmlFor="musicTitle" className="block text-sm font-medium text-card-foreground/90 mb-1">Music Title</Label>
          <Input 
            id="musicTitle" 
            value={musicTitleInput} 
            onChange={(e) => setMusicTitleInput(e.target.value)} 
            placeholder="e.g., My Awesome Track" 
            required 
            className="bg-background/70"
          />
        </div>
        <div>
          <Label htmlFor="musicUrl" className="block text-sm font-medium text-card-foreground/90 mb-1">Music URL (e.g., Soundcloud, Bandcamp, YouTube, MP3 link)</Label>
          <Input 
            id="musicUrl" 
            type="url" 
            value={musicUrlInput} 
            onChange={(e) => setMusicUrlInput(e.target.value)} 
            placeholder="https://example.com/your-music" 
            required 
            className="bg-background/70"
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Music2 size={18} className="mr-2"/> Add Music to Preview
        </Button>
      </form>
      
      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {staticPreviewNfts.map((nft) => (
          <div key={nft.id} className="group rounded-lg overflow-hidden shadow-md border border-border hover:shadow-xl transition-shadow flex flex-col">
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
            <div className="p-4 bg-card flex-grow flex flex-col">
              <h3 className="font-semibold text-card-foreground text-lg">{nft.name}</h3>
              {nft.description && <p className="text-xs text-muted-foreground mt-1 flex-grow">{nft.description}</p>}
            </div>
          </div>
        ))}
        {userMusicNft && (
          <div key={userMusicNft.id} className="group rounded-lg overflow-hidden shadow-md border border-primary hover:shadow-xl transition-shadow flex flex-col">
            <div className="aspect-square w-full overflow-hidden bg-muted/30 flex items-center justify-center">
              <Image
                src={userMusicNft.imageUrl}
                alt={userMusicNft.name}
                width={300}
                height={300}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={userMusicNft.dataAiHint}
              />
            </div>
            <div className="p-4 bg-card flex-grow flex flex-col">
              <h3 className="font-semibold text-card-foreground text-lg">{userMusicNft.name}</h3>
              {userMusicNft.musicUrl && (
                <a 
                  href={userMusicNft.musicUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-primary hover:underline mt-2 inline-flex items-center"
                >
                  <PlayCircle size={16} className="mr-1.5 shrink-0" /> Listen Here
                </a>
              )}
              {userMusicNft.description && <p className="text-xs text-muted-foreground mt-1 flex-grow">{userMusicNft.description}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <ButtonLink
          href="/nfts"
          variant="default"
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground group" // Added group for arrow animation
          icon={<Gem size={20} />}
        >
          Explore Full NFT Gallery <ArrowRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform"/>
        </ButtonLink>
      </div>
    </SectionCard>
  );
};

export default NftGalleryPreview;
