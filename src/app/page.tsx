
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/hero-section';
import TokenInfo from '@/components/token-info';
import BuyToken from '@/components/buy-token';
import WithdrawInfo from '@/components/withdraw-info';
import AirdropRewards from '@/components/airdrop-rewards';
import WhitepaperSection from '@/components/whitepaper-section';
import ContactLinks from '@/components/contact-links';
import CommunitySpotlightForm from '@/components/community-spotlight-form';
import NftGalleryPreview from '@/components/nft-gallery-preview';
import NftPurchase from '@/components/nft-purchase';
import MarketAnalytics from '@/components/market-analytics';
import EthereumNftDexTrades from '@/components/ethereum-nft-dex-trades';
import SepoliaBlockFeed from '@/components/sepolia-block-feed';


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <HeroSection />
        
        <div className="space-y-12 md:space-y-16 mt-12 md:mt-16">
          <section id="token-info-section">
            <TokenInfo />
          </section>
          
          <section>
            <MarketAnalytics />
          </section>

          <section>
            <EthereumNftDexTrades />
          </section>

          <section>
            <SepoliaBlockFeed />
          </section>

          <section>
            <NftGalleryPreview />
          </section>
          
          <section>
            <BuyToken />
          </section>

          <section>
            <WithdrawInfo />
          </section>

          <section>
            <NftPurchase />
          </section>
          
          <section>
            <AirdropRewards />
          </section>
          
          <section>
            <WhitepaperSection />
          </section>
          
          <section>
            <CommunitySpotlightForm />
          </section>
          
          <section>
            <ContactLinks />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
