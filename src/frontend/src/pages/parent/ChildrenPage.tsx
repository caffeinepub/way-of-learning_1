import EmptyState from '../../components/shared/EmptyState';

export default function ChildrenPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Children</h1>
      </div>

      <EmptyState
        title="No children linked"
        description="Link your children to monitor their progress"
      />
    </div>
  );
}
