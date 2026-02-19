import { useGetAllUsers, useIsCallerAdmin } from '../../hooks/useQueries';
import DashboardCard from '../../components/shared/DashboardCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Users, BookOpen, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data: users, isLoading } = useGetAllUsers();
  const { data: isAdmin } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  const teachers = users?.filter((u) => u.userType === 'teacher').length || 0;
  const students = users?.filter((u) => u.userType === 'student').length || 0;
  const parents = users?.filter((u) => u.userType === 'parent').length || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCard title="Total Users" value={users?.length || 0} icon={Users} variant="default" />
        <DashboardCard title="Teachers" value={teachers} icon={BookOpen} variant="info" />
        <DashboardCard title="Students" value={students} icon={FileText} variant="success" />
        <DashboardCard title="Parents" value={parents} icon={BarChart3} variant="warning" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="h-24"
          onClick={() => (window.location.hash = '#/admin/users')}
        >
          <Users className="mr-2 h-5 w-5" />
          Manage Users
        </Button>
        <Button
          variant="outline"
          className="h-24"
          onClick={() => (window.location.hash = '#/admin/monitoring')}
        >
          <BarChart3 className="mr-2 h-5 w-5" />
          Platform Monitoring
        </Button>
      </div>
    </div>
  );
}
