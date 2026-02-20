import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from '@tanstack/react-router';
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  User,
  GraduationCap,
  FileText,
  ClipboardList,
  BarChart3,
  Users,
  FolderOpen,
  MessagesSquare,
} from 'lucide-react';

interface SideNavigationProps {
  onNavigate?: () => void;
}

export default function SideNavigation({ onNavigate }: SideNavigationProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    const userType = userProfile?.userType;

    const commonItems = [
      { icon: Calendar, label: 'Calendar', path: '/calendar' },
      { icon: MessageSquare, label: 'Messages', path: '/messages' },
      { icon: MessagesSquare, label: 'Discussions', path: '/discussions' },
      { icon: User, label: 'Profile', path: '/profile' },
    ];

    if (userType === 'teacher') {
      return [
        { icon: Home, label: 'Dashboard', path: '/teacher' },
        { icon: BookOpen, label: 'My Classes', path: '/teacher' },
        { icon: FolderOpen, label: 'Materials', path: '/teacher/materials' },
        { icon: GraduationCap, label: 'Quizzes', path: '/teacher/quizzes' },
        ...commonItems,
      ];
    }

    if (userType === 'student') {
      return [
        { icon: Home, label: 'Dashboard', path: '/student' },
        { icon: BookOpen, label: 'My Classes', path: '/student' },
        { icon: FileText, label: 'Assignments', path: '/student/assignments' },
        { icon: FolderOpen, label: 'Materials', path: '/student/materials' },
        { icon: FileText, label: 'Grades', path: '/student/grades' },
        { icon: ClipboardList, label: 'Attendance', path: '/student/attendance' },
        { icon: GraduationCap, label: 'Quizzes', path: '/student/quizzes' },
        { icon: BarChart3, label: 'Progress', path: '/student/progress' },
        ...commonItems,
      ];
    }

    if (userType === 'parent') {
      return [
        { icon: Home, label: 'Dashboard', path: '/parent' },
        { icon: Users, label: 'My Children', path: '/parent/children' },
        ...commonItems,
      ];
    }

    return [
      { icon: Home, label: 'Dashboard', path: '/admin' },
      { icon: Users, label: 'Users', path: '/admin/users' },
      { icon: BarChart3, label: 'Monitoring', path: '/admin/monitoring' },
      ...commonItems,
    ];
  };

  const menuItems = getMenuItems();

  const handleNavigate = (path: string) => {
    navigate({ to: path }).catch((err) => {
      console.error('[SideNavigation] Navigation error:', err);
    });
    onNavigate?.();
  };

  return (
    <nav className="flex h-full flex-col gap-2 p-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

        return (
          <Button
            key={item.path}
            variant={isActive ? 'secondary' : 'ghost'}
            className="justify-start"
            onClick={() => handleNavigate(item.path)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}
