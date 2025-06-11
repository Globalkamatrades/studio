import type { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="bg-neutral-900 text-primary py-8 text-center shadow-lg">
      <div className="container mx-auto px-4">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Ecoho Gold (ECOHO)</h1>
        <p className="font-body text-lg md:text-xl mt-2 text-neutral-300">
          Africa's Wealth, Tokenized. Built on Binance Smart Chain.
        </p>
      </div>
    </header>
  );
};

export default Header;
