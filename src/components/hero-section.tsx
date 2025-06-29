
import type { FC } from 'react';
import Image from 'next/image';
import ButtonLink from '@/components/ui/button-link';
import { Sparkles } from 'lucide-react';

const HeroSection: FC = () => {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center overflow-hidden mb-12 rounded-lg shadow-xl border border-primary/20">
      <Image
        src="https://storage.googleapis.com/nkIiUzkATj3CxoP/Wlma5vgwwtwhpsa02tyI26Eg" 
        alt="Ecoho Gold - Digital Assets in a Modern Cityscape"
        fill
        className="object-cover"
        priority 
      />
      <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay for text legibility */}
      <div className="relative z-10 p-4 md:p-8">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-4 md:mb-6 leading-tight">
          Ecoho Gold
        </h1>
        <p className="font-body text-lg sm:text-xl md:text-2xl text-foreground max-w-xl lg:max-w-2xl mx-auto mb-6 md:mb-8">
          Bridging Africa's Wealth with Global Digital Finance.
          Invest in Commodity-Backed Cryptocurrency & Music NFTs.
        </p>
        <ButtonLink
          href="#token-info-section" 
          variant="default"
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3"
          icon={<Sparkles size={22} />}
        >
          Discover ECOHO
        </ButtonLink>
      </div>
    </section>
  );
};

export default HeroSection;
