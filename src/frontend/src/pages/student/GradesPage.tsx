import { useGetGrades } from '../../hooks/useQueries';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

export default function GradesPage() {
  const { data: grades, isLoading } = useGetGrades();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading grades..." />
      </div>
    );
  }

  if (!grades || grades.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Grades</h1>
        <EmptyState
          title="No grades yet"
          description="Your grades will appear here once your teacher grades your assignments"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Grades</h1>
      <div className="grid gap-4">
        {grades.map((grade, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Assignment {grade.assignmentId.toString()}</span>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  <span className="text-2xl font-bold">{grade.score.toString()}</span>
                </div>
              </CardTitle>
            </CardHeader>
            {grade.comments && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{grade.comments}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
