import EmptyState from '../../components/shared/EmptyState';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendar</h1>
      <EmptyState
        title="Calendar view coming soon"
        description="Your scheduled sessions and assignments will be displayed in a calendar format"
      />
    </div>
  );
}
