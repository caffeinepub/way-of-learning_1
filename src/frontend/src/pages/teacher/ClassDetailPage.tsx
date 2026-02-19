import { useParams } from '@tanstack/react-router';
import { useGetClassById, useGetSessions, useGetStudyMaterials, useGetAssignments } from '../../hooks/useQueries';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import SessionSchedulingModal from '../../components/teacher/SessionSchedulingModal';
import MaterialUploadModal from '../../components/teacher/MaterialUploadModal';
import AssignmentCreationModal from '../../components/teacher/AssignmentCreationModal';
import SessionCard from '../../components/shared/SessionCard';
import MaterialCard from '../../components/shared/MaterialCard';
import AssignmentCard from '../../components/shared/AssignmentCard';
import EmptyState from '../../components/shared/EmptyState';

export default function ClassDetailPage() {
  const { classId } = useParams({ from: '/teacher/class/$classId' });
  const { data: classData, isLoading } = useGetClassById(classId);
  const { data: sessions } = useGetSessions();
  const { data: materials } = useGetStudyMaterials();
  const { data: assignments } = useGetAssignments();

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

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
        <p className="text-muted-foreground">
          {classData.students.length} students enrolled
        </p>
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowSessionModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </div>
          {classSessions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {classSessions.map((session) => (
                <SessionCard key={session.id.toString()} session={session} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No sessions scheduled"
              description="Schedule your first session to get started"
              action={
                <Button onClick={() => setShowSessionModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Session
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowMaterialModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Material
            </Button>
          </div>
          {classMaterials.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classMaterials.map((material) => (
                <MaterialCard key={material.id.toString()} material={material} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No materials uploaded"
              description="Upload study materials for your students"
              action={
                <Button onClick={() => setShowMaterialModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Material
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowAssignmentModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </div>
          {classAssignments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {classAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id.toString()} assignment={assignment} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No assignments created"
              description="Create assignments for your students"
              imageSrc="/assets/generated/empty-assignments.dim_400x300.png"
              action={
                <Button onClick={() => setShowAssignmentModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="rounded-lg border">
            <div className="p-4">
              <h3 className="font-semibold">Enrolled Students</h3>
              <p className="text-sm text-muted-foreground">
                {classData.students.length} students
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <SessionSchedulingModal
        open={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        classId={BigInt(classId)}
      />
      <MaterialUploadModal
        open={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        classId={BigInt(classId)}
      />
      <AssignmentCreationModal
        open={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        classId={BigInt(classId)}
      />
    </div>
  );
}
