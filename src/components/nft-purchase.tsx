
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import SectionCard from '@/components/ui/section-card';
import ButtonLink from '@/components/ui/button-link';
import { Gem, ExternalLink, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface NftMarketData {
  floorPrice: number | null;
  priceCurrency: string | null;
  collectionUrl: string | null;
}

const NftPurchase: FC = () => {
  const [marketData, setMarketData] = useState<NftMarketData>({
    floorPrice: null,
    priceCurrency: null,
    collectionUrl: "https://opensea.io/collection/ecoho-music-nfts-official", // Default/fallback
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNftData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockApiResponse = {
          openSea: {
            floorPrice: 1.00,
            priceCurrency: "USD",
            collectionUrl: "https://opensea.io/collection/ecoho-music-nfts-official",
            error: null
          }
        };

        if (mockApiResponse.openSea && mockApiResponse.openSea.error) {
          setError(mockApiResponse.openSea.error);
          setMarketData(prev => ({ ...prev, collectionUrl: "https://opensea.io/" }));
        } else if (mockApiResponse.openSea) {
          setMarketData({
            floorPrice: mockApiResponse.openSea.floorPrice,
            priceCurrency: mockApiResponse.openSea.priceCurrency,
            collectionUrl: mockApiResponse.openSea.collectionUrl,
          });
        } else {
          setError("Could not fetch NFT market data from OpenSea.");
          setMarketData(prev => ({ ...prev, collectionUrl: "https://opensea.io/" }));
        }

      } catch (e: any) {
        console.error("Failed to fetch NFT data:", e);
        setError("An unexpected error occurred while fetching NFT data.");
        setMarketData(prev => ({ ...prev, collectionUrl: "https://opensea.io/" }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNftData();
  }, []);

  const openSeaLink = marketData.collectionUrl || "https://opensea.io/";

  return (
    <SectionCard title="Buy Official Ecoho NFTs & Get Rewards" icon={<Gem className="text-primary h-8 w-8" />}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Image
          src="https://placehold.co/300x200.png"
          alt="Ecoho Gold NFT Collection"
          width={300}
          height={200}
          className="rounded-lg shadow-md object-cover"
          data-ai-hint="abstract nft"
        />
        <div className="flex-1">
          <p className="mb-2 text-lg">
            Support the project and become part of the Ecoho Gold ecosystem by purchasing our exclusive NFTs.
          </p>
          <p className="mb-4 text-md font-semibold text-primary flex items-center">
            <Sparkles size={20} className="mr-2" /> Each NFT purchase rewards you with 7 ECOHO tokens!
          </p>

          {isLoading && (
            <div className="flex items-center text-muted-foreground mb-4">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Loading NFT market data...</span>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex items-center text-destructive bg-destructive/10 p-3 rounded-md mb-4 text-sm">
              <AlertTriangle className="mr-2 h-5 w-5" />
              <span>Error: {error}</span>
            </div>
          )}

          {!isLoading && !error && marketData.floorPrice !== null && (
            <p className="mb-2 text-xl font-semibold">
              Floor Price: {marketData.priceCurrency === "USD" ? "$" : ""}{marketData.floorPrice.toFixed(2)} {marketData.priceCurrency}
            </p>
          )}
          
           <p className="text-xs text-muted-foreground mb-2">
            When purchasing NFTs on the Ethereum network, be mindful of gas fees, which can fluctuate.
          </p>
          <ButtonLink
            href={openSeaLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            icon={<ExternalLink size={20}/>}
            disabled={isLoading}
          >
            Buy on OpenSea
          </ButtonLink>
          <p className="mt-3 text-xs text-muted-foreground">
            The 7 ECOHO token reward is a promotional offer and subject to change. ECOHO token value is speculative. Floor price is illustrative; a live API is needed for real-time data.
          </p>
        </div>
      </div>
    </SectionCard>
  );
};

export default NftPurchase;
