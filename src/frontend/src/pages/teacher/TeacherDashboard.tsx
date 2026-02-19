import { useState } from 'react';
import { useGetClasses, useGetSessions, useGetAssignments } from '../../hooks/useQueries';
import DashboardCard from '../../components/shared/DashboardCard';
import EmptyState from '../../components/shared/EmptyState';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, FileText, Plus } from 'lucide-react';
import ClassCreationModal from '../../components/teacher/ClassCreationModal';
import ClassCard from '../../components/teacher/ClassCard';

export default function TeacherDashboard() {
  const { data: classes, isLoading: classesLoading } = useGetClasses();
  const { data: sessions } = useGetSessions();
  const { data: assignments } = useGetAssignments();
  const [showCreateClass, setShowCreateClass] = useState(false);

  if (classesLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const upcomingSessions = sessions?.filter((s) => Number(s.dateTime) > Date.now() * 1000000) || [];
  const pendingAssignments = assignments?.filter((a) => Number(a.dueDate) > Date.now() * 1000000) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button onClick={() => setShowCreateClass(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Class
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="My Classes"
          value={classes?.length || 0}
          icon={BookOpen}
          variant="default"
        />
        <DashboardCard
          title="Upcoming Sessions"
          value={upcomingSessions.length}
          icon={Calendar}
          variant="info"
        />
        <DashboardCard
          title="Active Assignments"
          value={pendingAssignments.length}
          icon={FileText}
          variant="warning"
        />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">My Classes</h2>
        {classes && classes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((classItem) => (
              <ClassCard key={classItem.id.toString()} classData={classItem} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No classes yet"
            description="Create your first class to get started"
            imageSrc="/assets/generated/empty-classes.dim_400x300.png"
            action={
              <Button onClick={() => setShowCreateClass(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Class
              </Button>
            }
          />
        )}
      </div>

      <ClassCreationModal open={showCreateClass} onClose={() => setShowCreateClass(false)} />
    </div>
  );
}
