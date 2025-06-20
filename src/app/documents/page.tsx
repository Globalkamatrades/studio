
import type { NextPage } from 'next';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, ShieldCheck, Cookie } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ecoho Gold - Project Documents',
  description: 'Access key documents for the Ecoho Gold project, including whitepaper, privacy policy, and cookies policy.',
};

const DocumentsPage: NextPage = () => {
  const documents = [
    {
      title: 'Whitepaper',
      description: 'Read the official Ecoho Gold whitepaper detailing our vision, tokenomics, and roadmap.',
      href: '/whitepaper',
      icon: <FileText size={24} className="text-primary" />,
    },
    {
      title: 'Privacy Policy',
      description: 'Understand how we collect, use, and protect your personal information.',
      href: '/privacy-policy',
      icon: <ShieldCheck size={24} className="text-primary" />,
    },
    {
      title: 'Cookies Policy',
      description: 'Learn about the cookies we use on our website and how you can manage them.',
      href: '/cookies-policy',
      icon: <Cookie size={24} className="text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">
            Project Documents
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Access key documents related to the Ecoho Gold project.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Link href={doc.href} key={doc.title} className="block h-full">
                <Card className="h-full shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                  <CardHeader className="flex-row items-center gap-4 space-y-0">
                    {doc.icon}
                    <CardTitle>{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{doc.description}</CardDescription>
                  </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentsPage;
```