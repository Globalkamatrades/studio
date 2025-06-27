
import type { FC } from 'next';
import Link from 'next/link';
import ButtonLink from '@/components/ui/button-link';
import { LogIn, LayoutDashboard, Sparkles, Music, FileText } from 'lucide-react';


const Header: FC = () => {
  return (
    <header className="bg-neutral-900 text-primary py-6 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <Link href="/" passHref>
              <h1 className="font-headline text-4xl md:text-5xl font-bold cursor-pointer">Ecoho Gold (ECOHO)</h1>
            </Link>
            <p className="font-body text-lg md:text-xl mt-2 text-neutral-300">
              Africa's Wealth, Tokenized. Built on the Ethereum Network.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-2">
            <ButtonLink href="/nfts" variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <Sparkles size={18} /> Our NFTs
            </ButtonLink>
            <ButtonLink href="/music-nft-info" variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <Music size={18} /> Music NFT Info
            </ButtonLink>
            <ButtonLink href="/documents" variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <FileText size={18} /> Documents
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary-foreground">
              <LayoutDashboard size={18} /> Dashboard
            </ButtonLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
