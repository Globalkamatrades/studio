
"use client";

import type { NextPage } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Gem, ShieldCheck, Loader2 } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ButtonLink from '@/components/ui/button-link';
import { useState, useEffect } from 'react';

interface NftItem {
  id: number;
  name: string;
  imageUrl: string;
  dataAiHint: string;
  description: string;
  openseaLink: string;
}

const initialNftData: NftItem[] = [
  {
    id: 1,
    name: "Ecoho Genesis Drop",
    imageUrl: "https://placehold.co/400x400.png",
    dataAiHint: "gold abstract",
    description: "The very first collection symbolizing the dawn of Ecoho Gold. Holders get exclusive perks.",
    openseaLink: "https://opensea.io/collection/ecoho-music-nfts-official"
  },
  {
    id: 2,
    name: "African Beats Series",
    imageUrl: "https://placehold.co/400x400.png",
    dataAiHint: "music rhythm",
    description: "A series celebrating diverse African musical talents, backed by unique commodity assets.",
    openseaLink: "https://opensea.io/collection/ecoho-music-nfts-official"
  },
  {
    id: 3,
    name: "Uranium Art Project",
    imageUrl: "https://placehold.co/400x400.png",
    dataAiHint: "energy glow",
    description: "Unique art pieces digitally representing the energy and value of uranium reserves.",
    openseaLink: "https://opensea.io/collection/ecoho-music-nfts-official"
  },
  {
    id: 4,
    name: "Platinum Heritage",
    imageUrl: "https://placehold.co/400x400.png",
    dataAiHint: "platinum luxury",
    description: "NFTs representing stakes in sustainably sourced platinum, blending tradition with technology.",
    openseaLink: "https://opensea.io/collection/ecoho-music-nfts-official"
  },
];

const NftsPage: NextPage = () => {
  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setNfts(initialNftData);
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary flex items-center justify-center gap-3">
            <Gem size={40} /> Our NFT Collections
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Explore the unique Non-Fungible Tokens offered by Ecoho Gold. Each NFT is a piece of digital art,
            a collectible, and a representation of value within our ecosystem.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-xl text-muted-foreground">Loading NFT Collections...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <Card key={nft.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-square w-full overflow-hidden">
                   <Image
                    src={nft.imageUrl}
                    alt={nft.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={nft.dataAiHint}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="font-headline text-xl">{nft.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{nft.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <ButtonLink 
                    href={nft.openseaLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    icon={<ExternalLink size={18} />}
                  >
                    View on OpenSea
                  </ButtonLink>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-12 bg-card/70 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><ShieldCheck /> NFT Authenticity & Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground/90 mb-2">
              All official Ecoho Gold NFTs are verifiable on the Ethereum network.
              Ownership often comes with exclusive benefits like early access to features, ECOHO token airdrops, and access to special community events.
            </p>
            <p className="text-sm text-muted-foreground">
              Ensure you are purchasing from official Ecoho Gold collections on reputable marketplaces. Remember, NFT purchases may also grant promotional ECOHO token rewards.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default NftsPage;
