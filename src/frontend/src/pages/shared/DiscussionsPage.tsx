import EmptyState from '../../components/shared/EmptyState';

export default function DiscussionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Discussions</h1>
      </div>

      <EmptyState
        title="Discussion forums coming soon"
        description="This feature is under development"
      />
    </div>
  );
}
