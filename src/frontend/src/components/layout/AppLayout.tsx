import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import SideNavigation from './SideNavigation';
import BottomNavigation from './BottomNavigation';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import ProfileAvatar from '../profile/ProfileAvatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' }).catch((err) => {
      console.error('[AppLayout] Navigation error:', err);
    });
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SideNavigation onNavigate={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-primary">Way of Learning</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <ProfileAvatar profile={userProfile} size="sm" />
              <span className="text-sm font-medium">{userProfile?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation - Desktop */}
        <aside className="hidden w-64 border-r bg-card lg:block">
          <SideNavigation />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <BottomNavigation />
    </div>
  );
}
