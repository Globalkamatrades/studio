
import type { NextPage } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, BarChart2, Settings, Gift, ShieldCheck } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const DashboardPage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-headline text-4xl md:text-5xl text-primary flex items-center justify-center gap-3">
            <LayoutDashboard size={40} /> Ecoho Gold Dashboard
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Welcome to your personal hub for managing your Ecoho Gold assets, tracking rewards, and engaging with the community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck /> Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Enterprise Name:</p>
                  <p className="text-lg font-semibold text-primary">K2021753276 (SOUTH AFRICA)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registration Number:</p>
                  <p className="text-lg font-semibold text-primary">2021 / 753276 / 07</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registered Office:</p>
                  <p className="text-md text-primary">1138 Tsebe Unit T, Mabopane, Gauteng, 1138</p>
                </div>
              </div>
               <p className="text-muted-foreground mt-4 text-xs">
                Official company details for Ecoho Gold.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart2 /> My Ecoho Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">ECOHO Token Balance:</p>
                  <p className="text-2xl font-semibold text-primary">1,250 ECOHO</p>
                  <p className="text-xs text-muted-foreground">(Illustrative balance)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">My NFTs:</p>
                  <p className="text-2xl font-semibold text-primary">2 NFTs</p>
                  <p className="text-xs text-muted-foreground">(Illustrative count)</p>
                </div>
                 <div>
                  <p className="text-sm text-muted-foreground">ECOHO from NFT Purchases:</p>
                  <p className="text-lg font-semibold text-primary">+14 ECOHO</p>
                  <p className="text-xs text-muted-foreground">(Illustrative, 2 NFTs x 7 ECOHO/NFT)</p>
                </div>
              </div>
              <p className="text-muted-foreground mt-3">Track your token and NFT investments in the Ecoho Gold ecosystem.</p>
              <p className="mt-4 text-sm text-primary/80 font-semibold">(Live asset tracking coming soon)</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gift /> Rewards & Contributions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Community Spotlight Rewards:</p>
                        <p className="text-lg font-semibold text-primary">Pending</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Airdrop Participation:</p>
                        <p className="text-lg font-semibold text-primary">(Details on eligibility soon)</p>
                    </div>
                </div>
                <p className="text-muted-foreground mt-3">Earn tokens for your engagement, NFT purchases, and community contributions.</p>
                <p className="mt-4 text-sm text-primary/80 font-semibold">(Reward system under development)</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings /> Account & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage your login credentials, notification preferences, and security settings.</p>
              <p className="mt-4 text-sm text-primary/80 font-semibold">(Account settings coming soon)</p>
            </CardContent>
          </Card>
        </div>

         <Card className="mt-10 text-center bg-card/70 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary flex items-center justify-center gap-2"><ShieldCheck size={28}/> Unlock Full Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground/90">
              Full dashboard functionality, including live asset tracking, detailed reward management, and advanced profile settings, requires user authentication.
            </p>
            <p className="text-card-foreground/90 mt-2">
              Secure login and comprehensive account features are currently under development and will be available soon!
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
```