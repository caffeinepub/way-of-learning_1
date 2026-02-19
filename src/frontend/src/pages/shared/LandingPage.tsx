import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { GraduationCap, BookOpen, Users, Calendar, MessageSquare, BarChart3 } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';

export default function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  const features = [
    {
      icon: GraduationCap,
      title: 'For Teachers',
      description: 'Create classes, manage assignments, track attendance, and grade students efficiently.',
    },
    {
      icon: BookOpen,
      title: 'For Students',
      description: 'Access study materials, submit assignments, take quizzes, and track your progress.',
    },
    {
      icon: Users,
      title: 'For Parents',
      description: 'Monitor your child\'s academic performance, attendance, and communicate with teachers.',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Organize classes, assignments, and quizzes with an integrated calendar system.',
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Stay connected with discussion boards and direct messaging between teachers, students, and parents.',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Visual analytics and reports to understand learning trends and performance.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-background dark:from-orange-950/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <img
            src="/assets/generated/hero-education.dim_1200x600.png"
            alt="Education"
            className="mb-8 max-w-2xl rounded-2xl shadow-lg"
          />
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-6xl">
            Way of Learning
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            A complete education platform connecting teachers, students, and parents in one seamless experience.
          </p>
          <Button size="lg" onClick={login} disabled={isLoggingIn} className="text-lg">
            {isLoggingIn ? 'Logging in...' : 'Get Started'}
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Everything You Need</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                  <Icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © {new Date().getFullYear()} Way of Learning. Built with{' '}
            <SiCaffeine className="h-4 w-4 text-orange-600" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
