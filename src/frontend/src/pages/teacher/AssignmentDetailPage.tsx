import { useParams } from '@tanstack/react-router';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function AssignmentDetailPage() {
  const { assignmentId } = useParams({ from: '/teacher/assignment/$assignmentId' });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Assignment Details</h1>
      <p className="text-muted-foreground">Assignment ID: {assignmentId}</p>
      <p className="text-sm text-muted-foreground">Grading interface coming soon...</p>
    </div>
  );
}
