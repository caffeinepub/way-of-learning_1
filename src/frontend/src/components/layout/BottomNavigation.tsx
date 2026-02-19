import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Home, BookOpen, Calendar, MessageSquare, User } from 'lucide-react';

export default function BottomNavigation() {
  const { data: userProfile } = useGetCallerUserProfile();

  const getNavItems = () => {
    const userType = userProfile?.userType;

    if (userType === 'teacher') {
      return [
        { icon: Home, label: 'Home', path: '/teacher' },
        { icon: BookOpen, label: 'Classes', path: '/teacher' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
        { icon: User, label: 'Profile', path: '/profile' },
      ];
    }

    if (userType === 'student') {
      return [
        { icon: Home, label: 'Home', path: '/student' },
        { icon: BookOpen, label: 'Classes', path: '/student' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
        { icon: User, label: 'Profile', path: '/profile' },
      ];
    }

    if (userType === 'parent') {
      return [
        { icon: Home, label: 'Home', path: '/parent' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
        { icon: User, label: 'Profile', path: '/profile' },
      ];
    }

    return [
      { icon: Home, label: 'Home', path: '/admin' },
      { icon: User, label: 'Profile', path: '/profile' },
    ];
  };

  const navItems = getNavItems();

  const handleNavigate = (path: string) => {
    window.location.hash = `#${path}`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card lg:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = window.location.hash.includes(item.path);

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
