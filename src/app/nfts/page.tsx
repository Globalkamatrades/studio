
import type { NextPage } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ButtonLink from '@/components/ui/button-link';

const NftsPage: NextPage = () => {
  const openSeaCollectionLink = "https://opensea.io/collection/ecoho-gold-official";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary flex items-center justify-center gap-3">
            <Gem size={40} /> Official NFT Collections
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Discover the value and utility of owning an official Ecoho Gold NFT.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src="https://placehold.co/800x300.png"
                alt="Ecoho Gold NFT Banner"
                layout="fill"
                objectFit="cover"
                data-ai-hint="abstract nft gold"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Purchase Our Exclusive NFTs</CardTitle>
              <CardDescription>
                Become a part of the Ecoho Gold ecosystem by acquiring our unique digital assets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-card-foreground/90">
                Our NFT collections are more than just digital art; they are a key to unlocking further utility within the Ecoho Gold project. Ownership provides you with exclusive benefits and a deeper connection to our community.
              </p>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="font-semibold text-primary flex items-center gap-2">
                  <Sparkles size={20} /> Exclusive Reward
                </p>
                <p className="text-primary/90 mt-1">
                  As a thank you to our supporters, each official NFT purchase from our collection rewards you with <strong>7 bonus ECOHO tokens</strong>.
                </p>
              </div>
               <div className="p-4 bg-card/50 rounded-lg border border-border">
                <p className="font-semibold text-card-foreground flex items-center gap-2">
                  <ShieldCheck size={20} /> Authenticity Guaranteed
                </p>
                <p className="text-muted-foreground mt-1">
                  All official Ecoho Gold NFTs are verifiable on the Ethereum network. To ensure authenticity and security, please only purchase through our official OpenSea collection linked below.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <ButtonLink
                href={openSeaCollectionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                icon={<ExternalLink size={18} />}
                size="lg"
              >
                View Collection on OpenSea
              </ButtonLink>
            </CardFooter>
          </Card>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default NftsPage;
