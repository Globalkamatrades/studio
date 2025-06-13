
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import AudiusPlayer from '@/components/audius-player';
import NftPurchase from '@/components/nft-purchase';
import TokenInfo from '@/components/token-info';
import BuyToken from '@/components/buy-token';
import AirdropRewards from '@/components/airdrop-rewards';
import WhitepaperSection from '@/components/whitepaper-section';
import ContactLinks from '@/components/contact-links';
import CommunitySpotlightForm from '@/components/community-spotlight-form';
import MarketAnalytics from '@/components/market-analytics'; // Added import

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8 md:space-y-12">
          <TokenInfo />
          <MarketAnalytics /> {/* Added new component */}
          <BuyToken />
          <NftPurchase />
          <AudiusPlayer />
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

    