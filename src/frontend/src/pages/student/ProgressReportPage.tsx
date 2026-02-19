import EmptyState from '../../components/shared/EmptyState';

export default function ProgressReportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Progress Report</h1>
      <EmptyState
        title="Progress analytics coming soon"
        description="Visual charts and performance trends will be displayed here"
      />
    </div>
  );
}
