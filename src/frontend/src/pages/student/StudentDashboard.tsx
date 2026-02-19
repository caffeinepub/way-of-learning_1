import { useState } from 'react';
import { useGetClasses, useGetSessions, useGetAssignments, useGetGrades } from '../../hooks/useQueries';
import DashboardCard from '../../components/shared/DashboardCard';
import EmptyState from '../../components/shared/EmptyState';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, FileText, Award, Plus } from 'lucide-react';
import ClassEnrollmentModal from '../../components/student/ClassEnrollmentModal';
import StudentClassCard from '../../components/student/StudentClassCard';

export default function StudentDashboard() {
  const { data: classes, isLoading: classesLoading } = useGetClasses();
  const { data: sessions } = useGetSessions();
  const { data: assignments } = useGetAssignments();
  const { data: grades } = useGetGrades();
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  if (classesLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const upcomingSessions = sessions?.filter((s) => Number(s.dateTime) > Date.now() * 1000000) || [];
  const pendingAssignments = assignments?.filter((a) => Number(a.dueDate) > Date.now() * 1000000) || [];
  const averageGrade = grades && grades.length > 0
    ? grades.reduce((sum, g) => sum + Number(g.score), 0) / grades.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <Button onClick={() => setShowEnrollModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Join Class
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
          title="Pending Assignments"
          value={pendingAssignments.length}
          icon={FileText}
          variant="warning"
        />
        <DashboardCard
          title="Average Grade"
          value={averageGrade.toFixed(1)}
          icon={Award}
          variant="success"
        />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">My Classes</h2>
        {classes && classes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((classItem) => (
              <StudentClassCard key={classItem.id.toString()} classData={classItem} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No classes enrolled"
            description="Join your first class using an enrollment code"
            imageSrc="/assets/generated/empty-classes.dim_400x300.png"
            action={
              <Button onClick={() => setShowEnrollModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Join Class
              </Button>
            }
          />
        )}
      </div>

      <ClassEnrollmentModal open={showEnrollModal} onClose={() => setShowEnrollModal(false)} />
    </div>
  );
}
