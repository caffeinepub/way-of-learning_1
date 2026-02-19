import { useParams } from '@tanstack/react-router';

export default function SessionDetailPage() {
  const { sessionId } = useParams({ from: '/teacher/session/$sessionId' });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Session Details</h1>
      <p className="text-muted-foreground">Session ID: {sessionId}</p>
      <p className="text-sm text-muted-foreground">Attendance tracking interface coming soon...</p>
    </div>
  );
}
