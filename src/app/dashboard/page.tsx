import type { NextPage } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, UserCircle, BarChart2, Settings } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const DashboardPage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl text-primary flex items-center justify-center gap-3">
            <LayoutDashboard size={36} /> User Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            This is your personal dashboard. More features coming soon!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCircle /> My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and manage your profile information.</p>
              <p className="mt-4 text-sm text-primary font-semibold">(Feature under development)</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart2 /> My Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Track your ECOHO tokens and NFTs.</p>
              <p className="mt-4 text-sm text-primary font-semibold">(Feature under development)</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings /> Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage your account preferences and security.</p>
              <p className="mt-4 text-sm text-primary font-semibold">(Feature under development)</p>
            </CardContent>
          </Card>
        </div>
         <Card className="mt-8 text-center bg-card/50">
          <CardHeader>
            <CardTitle className="text-primary">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground">
              Please note: Full dashboard functionality will require user login.
              Authentication is currently under development.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
