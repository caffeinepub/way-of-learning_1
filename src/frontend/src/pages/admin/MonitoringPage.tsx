import EmptyState from '../../components/shared/EmptyState';

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Platform Monitoring</h1>
      <EmptyState
        title="Analytics coming soon"
        description="Platform usage statistics and activity trends will be displayed here"
      />
    </div>
  );
}
