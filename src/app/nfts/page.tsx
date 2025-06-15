import type { NextPage } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Gem, ShieldCheck } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ButtonLink from '@/components/ui/button-link';

const nftPlaceholders = [
  {
    id: 1,
    name: "Ecoho Genesis Drop",
    imageUrl: "https://placehold.co/400x400.png",
    dataAiHint: "gold abstract",
    description: "The very first collection symbolizing the dawn of Ecoho Gold. Holders get exclusive perks.",
    openseaLink: "https://opensea.io/collection/ecoho-music-nfts-official" // Replace with actual
  },
  {
    id: 2,
    name: "African Beats Series",
    imageUrl: "https://placehold.co/400x400.png",
    dataAiHint: "music rhythm",
    description: "A series celebrating diverse African musical talents, backed by unique commodity assets.",
    openseaLink: "https://opensea.io/collection/ecoho-music-nfts-official" // Replace with actual
  },
  {
    id: 3,
    name: "Uranium Art Project",
    imageUrl: "https://placehold.co/400x400.png",
    dataAiHint: "energy glow",
    description: "Unique art pieces digitally representing the energy and value of uranium reserves.",
    openseaLink: "https://opensea.io/collection/ecoho-music-nfts-official" // Replace with actual
  },
    {
    id: 4,
    name: "Platinum Heritage",
    imageUrl: "https://placehold.co/400x400.png",
    dataAiHint: "platinum luxury",
    description: "NFTs representing stakes in sustainably sourced platinum, blending tradition with technology.",
    openseaLink: "https://opensea.io/collection/ecoho-music-nfts-official" // Replace with actual
  },
];

const NftsPage: NextPage = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nftPlaceholders.map((nft) => (
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

        <Card className="mt-12 bg-card/70 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><ShieldCheck /> NFT Authenticity & Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground/90 mb-2">
              All official Ecoho Gold NFTs are verifiable on the Binance Smart Chain.
              Ownership often comes with exclusive benefits, including ECOHO token airdrops and access to special community events.
            </p>
            <p className="text-sm text-muted-foreground">
              Ensure you are purchasing from official Ecoho Gold collections on reputable marketplaces.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default NftsPage;
