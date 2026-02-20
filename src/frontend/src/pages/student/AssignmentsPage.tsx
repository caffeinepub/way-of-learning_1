import { useGetAssignments, useGetCallerUserProfile } from '../../hooks/useQueries';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

export default function AssignmentsPage() {
  const { data: assignments, isLoading } = useGetAssignments();
  const { data: userProfile } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading assignments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assignments</h1>
      </div>

      {assignments && assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const dueDate = new Date(Number(assignment.dueDate) / 1000000);
            const isPastDue = dueDate < new Date();

            return (
              <Card key={assignment.id.toString()}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold">{assignment.title}</h3>
                      <p className="mb-3 text-sm text-muted-foreground">{assignment.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Due: {dueDate.toLocaleDateString()}</span>
                        </div>
                        <span>Max Points: {assignment.maxPoints.toString()}</span>
                      </div>
                    </div>
                    <Badge variant={isPastDue ? 'destructive' : 'default'}>
                      {isPastDue ? 'Past Due' : 'Pending'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No assignments"
          description="You don't have any assignments yet"
          imageSrc="/assets/generated/empty-assignments.dim_400x300.png"
        />
      )}
    </div>
  );
}
