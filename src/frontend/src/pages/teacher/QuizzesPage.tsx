import EmptyState from '../../components/shared/EmptyState';

export default function QuizzesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quizzes</h1>
      </div>

      <EmptyState
        title="Quiz management coming soon"
        description="This feature is under development"
      />
    </div>
  );
}
