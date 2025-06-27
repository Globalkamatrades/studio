
"use client";

import type { FC } from 'react';
import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gem, Sparkles, ArrowRight, Newspaper, PlayCircle, Tag, Link as LinkIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PreviewNftItem {
  id: string | number;
  name: string;
  imageUrl: string;
  dataAiHint: string;
  contentUrl?: string;
  description?: string;
  price?: string;
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
  const [contentUrlInput, setContentUrlInput] = useState('');
  const [contentHeadlineInput, setContentHeadlineInput] = useState('');
  const [contentPriceInput, setContentPriceInput] = useState('');
  const [userContentNft, setUserContentNft] = useState<PreviewNftItem | null>(null);

  const handleUserContentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (contentHeadlineInput.trim() && contentUrlInput.trim()) {
      setUserContentNft({
        id: 'user-submitted-' + Date.now(),
        name: contentHeadlineInput,
        imageUrl: 'https://placehold.co/300x300.png', // Generic image for content
        dataAiHint: 'news content abstract',
        contentUrl: contentUrlInput,
        description: "User-submitted content.",
        price: contentPriceInput.trim() || undefined,
      });
    }
  };

  return (
    <SectionCard title="Featured NFTs & Community Content" icon={<Newspaper className="text-primary h-8 w-8" />}>
      <p className="mb-6 text-lg">
        Discover unique digital collectibles and featured content from the community. You can also feature your own NFT news or content link below!
      </p>

      {/* Form to add content URL */}
      <form onSubmit={handleUserContentSubmit} className="my-6 p-4 border-2 border-dashed border-primary/30 rounded-lg shadow-inner bg-card/50 space-y-4">
        <h3 className="text-xl font-headline text-primary mb-3">Feature Your Content</h3>
        <div>
          <Label htmlFor="contentHeadline" className="block text-sm font-medium text-card-foreground/90 mb-1">Content Headline</Label>
          <Input 
            id="contentHeadline" 
            value={contentHeadlineInput} 
            onChange={(e) => setContentHeadlineInput(e.target.value)} 
            placeholder="e.g., The Latest in NFT Security" 
            required 
            className="bg-background/70"
          />
        </div>
        <div>
          <Label htmlFor="contentUrl" className="block text-sm font-medium text-card-foreground/90 mb-1">Content URL (e.g., TikTok, X, Blog Post)</Label>
          <Input 
            id="contentUrl" 
            type="url" 
            value={contentUrlInput} 
            onChange={(e) => setContentUrlInput(e.target.value)} 
            placeholder="https://tiktok.com/.../your-video" 
            required 
            className="bg-background/70"
          />
        </div>
        <div>
          <Label htmlFor="contentPrice" className="block text-sm font-medium text-card-foreground/90 mb-1">Price (Optional, e.g., 10 ECOHO)</Label>
          <Input 
            id="contentPrice" 
            value={contentPriceInput} 
            onChange={(e) => setContentPriceInput(e.target.value)} 
            placeholder="e.g., 10 ECOHO or 0.5 BNB" 
            className="bg-background/70"
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Newspaper size={18} className="mr-2"/> Add Content to Preview
        </Button>
      </form>
      
      <Alert variant="default" className="mb-6 bg-primary/5 border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Marketplace Preview</AlertTitle>
          <AlertDescription className="text-primary/80">
            The "Feature Your Content" section is a UI demonstration. Actual sales and token transactions would require further backend and blockchain development.
          </AlertDescription>
      </Alert>

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
        {userContentNft && (
          <div key={userContentNft.id} className="group rounded-lg overflow-hidden shadow-md border border-primary hover:shadow-xl transition-shadow flex flex-col">
            <div className="aspect-square w-full overflow-hidden bg-muted/30 flex items-center justify-center">
              <Image
                src={userContentNft.imageUrl}
                alt={userContentNft.name}
                width={300}
                height={300}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={userContentNft.dataAiHint}
              />
            </div>
            <div className="p-4 bg-card flex-grow flex flex-col">
              <h3 className="font-semibold text-card-foreground text-lg">{userContentNft.name}</h3>
              {userContentNft.contentUrl && (
                <a 
                  href={userContentNft.contentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-primary hover:underline mt-2 inline-flex items-center"
                >
                  <LinkIcon size={16} className="mr-1.5 shrink-0" /> View Content
                </a>
              )}
              {userContentNft.price && (
                <div className="mt-2 text-sm text-card-foreground/90 flex items-center">
                  <Tag size={16} className="mr-1.5 shrink-0 text-primary" />
                  Price: <span className="font-semibold ml-1">{userContentNft.price}</span>
                </div>
              )}
              {userContentNft.description && <p className="text-xs text-muted-foreground mt-1 flex-grow">{userContentNft.description}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <ButtonLink
          href="/nfts"
          variant="default"
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground group" 
          icon={<Gem size={20} />}
        >
          Explore Full NFT Gallery <ArrowRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform"/>
        </ButtonLink>
      </div>
    </SectionCard>
  );
};

export default NftGalleryPreview;
