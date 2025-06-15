
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import NftPurchase from '@/components/nft-purchase';
import TokenInfo from '@/components/token-info';
import BuyToken from '@/components/buy-token';
import AirdropRewards from '@/components/airdrop-rewards';
import WhitepaperSection from '@/components/whitepaper-section';
import ContactLinks from '@/components/contact-links';
import CommunitySpotlightForm from '@/components/community-spotlight-form';
import MarketAnalytics from '@/components/market-analytics';
import EthereumNftDexTrades from '@/components/ethereum-nft-dex-trades';
import NftGalleryPreview from '@/components/nft-gallery-preview'; // New import

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8 md:space-y-12">
          <TokenInfo />
          <MarketAnalytics />
          <EthereumNftDexTrades />
          <BuyToken />
          <NftGalleryPreview /> {/* Added NFT Gallery Preview */}
          <NftPurchase />
          <AirdropRewards />
          <WhitepaperSection />
          <CommunitySpotlightForm />
          <ContactLinks />
        </div>
      </main>
      <Footer />
    </div>
  );
}
