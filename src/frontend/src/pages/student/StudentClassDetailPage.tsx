import { useParams } from '@tanstack/react-router';
import { useGetClassById, useGetSessions, useGetStudyMaterials, useGetAssignments } from '../../hooks/useQueries';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionCard from '../../components/shared/SessionCard';
import MaterialCard from '../../components/shared/MaterialCard';
import AssignmentCard from '../../components/shared/AssignmentCard';
import EmptyState from '../../components/shared/EmptyState';

export default function StudentClassDetailPage() {
  const { classId } = useParams({ from: '/student/class/$classId' });
  const { data: classData, isLoading } = useGetClassById(classId);
  const { data: sessions } = useGetSessions();
  const { data: materials } = useGetStudyMaterials();
  const { data: assignments } = useGetAssignments();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading class..." />
      </div>
    );
  }

  if (!classData) {
    return <div>Class not found</div>;
  }

  const classSessions = sessions?.filter((s) => s.classId.toString() === classId) || [];
  const classMaterials = materials?.filter((m) => m.classId.toString() === classId) || [];
  const classAssignments = assignments?.filter((a) => a.classId.toString() === classId) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{classData.name}</h1>
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          {classSessions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {classSessions.map((session) => (
                <SessionCard key={session.id.toString()} session={session} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No sessions scheduled"
              description="Your teacher hasn't scheduled any sessions yet"
            />
          )}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          {classMaterials.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classMaterials.map((material) => (
                <MaterialCard key={material.id.toString()} material={material} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No materials available"
              description="Your teacher hasn't uploaded any materials yet"
            />
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {classAssignments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {classAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id.toString()} assignment={assignment} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No assignments"
              description="Your teacher hasn't created any assignments yet"
              imageSrc="/assets/generated/empty-assignments.dim_400x300.png"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
