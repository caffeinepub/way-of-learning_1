import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { createRouter, RouterProvider, useNavigate } from '@tanstack/react-router';
import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import LandingPage from './pages/shared/LandingPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import ClassDetailPage from './pages/teacher/ClassDetailPage';
import StudentClassDetailPage from './pages/student/StudentClassDetailPage';
import AssignmentDetailPage from './pages/teacher/AssignmentDetailPage';
import SessionDetailPage from './pages/teacher/SessionDetailPage';
import GradesPage from './pages/student/GradesPage';
import AttendancePage from './pages/student/AttendancePage';
import QuizzesPage from './pages/student/QuizzesPage';
import ProgressReportPage from './pages/student/ProgressReportPage';
import ChildDetailPage from './pages/parent/ChildDetailPage';
import MessagesPage from './pages/shared/MessagesPage';
import CalendarPage from './pages/shared/CalendarPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import MonitoringPage from './pages/admin/MonitoringPage';
import AppLayout from './components/layout/AppLayout';
import RoleSelectionModal from './components/auth/RoleSelectionModal';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

function IndexPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoading = isInitializing || actorFetching || profileLoading;

  useEffect(() => {
    console.log('[App] Auth state:', { isAuthenticated, profileLoading, isFetched, userProfile: userProfile?.userType });
    
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      console.log('[App] Showing role selection modal');
      setShowRoleSelection(true);
    } else if (isAuthenticated && userProfile) {
      console.log('[App] User profile exists, hiding role selection');
      setShowRoleSelection(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  useEffect(() => {
    if (isAuthenticated && userProfile && !showRoleSelection) {
      console.log('[App] Redirecting to dashboard for role:', userProfile.userType);
      
      const redirectPath = (() => {
        switch (userProfile.userType) {
          case 'teacher':
            return '/teacher';
          case 'student':
            return '/student';
          case 'parent':
            return '/parent';
          default:
            return '/';
        }
      })();

      if (redirectPath !== '/') {
        navigate({ to: redirectPath }).catch((err) => {
          console.error('[App] Navigation error:', err);
        });
      }
    }
  }, [isAuthenticated, userProfile, showRoleSelection, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (showRoleSelection) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <RoleSelectionModal 
          open={showRoleSelection} 
          onClose={() => setShowRoleSelection(false)} 
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size="lg" text="Redirecting..." />
    </div>
  );
}

const teacherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher',
  component: () => (
    <AppLayout>
      <TeacherDashboard />
    </AppLayout>
  ),
});

const teacherClassRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher/class/$classId',
  component: () => (
    <AppLayout>
      <ClassDetailPage />
    </AppLayout>
  ),
});

const teacherAssignmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher/assignment/$assignmentId',
  component: () => (
    <AppLayout>
      <AssignmentDetailPage />
    </AppLayout>
  ),
});

const teacherSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teacher/session/$sessionId',
  component: () => (
    <AppLayout>
      <SessionDetailPage />
    </AppLayout>
  ),
});

const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student',
  component: () => (
    <AppLayout>
      <StudentDashboard />
    </AppLayout>
  ),
});

const studentClassRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/class/$classId',
  component: () => (
    <AppLayout>
      <StudentClassDetailPage />
    </AppLayout>
  ),
});

const studentGradesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/grades',
  component: () => (
    <AppLayout>
      <GradesPage />
    </AppLayout>
  ),
});

const studentAttendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/attendance',
  component: () => (
    <AppLayout>
      <AttendancePage />
    </AppLayout>
  ),
});

const studentQuizzesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/quizzes',
  component: () => (
    <AppLayout>
      <QuizzesPage />
    </AppLayout>
  ),
});

const studentProgressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student/progress',
  component: () => (
    <AppLayout>
      <ProgressReportPage />
    </AppLayout>
  ),
});

const parentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parent',
  component: () => (
    <AppLayout>
      <ParentDashboard />
    </AppLayout>
  ),
});

const parentChildRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parent/child/$childId',
  component: () => (
    <AppLayout>
      <ChildDetailPage />
    </AppLayout>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AppLayout>
      <AdminDashboard />
    </AppLayout>
  ),
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: () => (
    <AppLayout>
      <UserManagementPage />
    </AppLayout>
  ),
});

const adminMonitoringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/monitoring',
  component: () => (
    <AppLayout>
      <MonitoringPage />
    </AppLayout>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <AppLayout>
      <ProfilePage />
    </AppLayout>
  ),
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: () => (
    <AppLayout>
      <MessagesPage />
    </AppLayout>
  ),
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: () => (
    <AppLayout>
      <CalendarPage />
    </AppLayout>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  teacherRoute,
  teacherClassRoute,
  teacherAssignmentRoute,
  teacherSessionRoute,
  studentRoute,
  studentClassRoute,
  studentGradesRoute,
  studentAttendanceRoute,
  studentQuizzesRoute,
  studentProgressRoute,
  parentRoute,
  parentChildRoute,
  adminRoute,
  adminUsersRoute,
  adminMonitoringRoute,
  profileRoute,
  messagesRoute,
  calendarRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
