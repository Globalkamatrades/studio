import type { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-neutral-900 text-primary py-6 text-center mt-12 shadow-top">
      <div className="container mx-auto px-4">
        <p className="font-body text-neutral-400">
          &copy; {new Date().getFullYear()} Ecoho Gold. Built with purpose in Africa.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
