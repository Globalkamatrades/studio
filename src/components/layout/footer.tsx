
import type { FC } from 'next';
import Link from 'next/link';

const Footer: FC = () => {
  return (
    <footer className="bg-neutral-900 text-primary py-6 text-center mt-12 shadow-top">
      <div className="container mx-auto px-4">
        <p className="font-body text-neutral-400">
          &copy; {new Date().getFullYear()} Ecoho Gold. Built with purpose in Africa.
        </p>
        <div className="mt-2 space-x-4">
          <Link href="/documents" className="text-neutral-500 hover:text-primary text-sm">
            Documents
          </Link>
          <Link href="/privacy-policy" className="text-neutral-500 hover:text-primary text-sm">
            Privacy Policy
          </Link>
          <Link href="/cookies-policy" className="text-neutral-500 hover:text-primary text-sm">
            Cookies Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
