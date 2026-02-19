import { useParams } from '@tanstack/react-router';

export default function ChildDetailPage() {
  const { childId } = useParams({ from: '/parent/child/$childId' });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Child Progress</h1>
      <p className="text-muted-foreground">Child ID: {childId}</p>
      <p className="text-sm text-muted-foreground">Detailed progress view coming soon...</p>
    </div>
  );
}
