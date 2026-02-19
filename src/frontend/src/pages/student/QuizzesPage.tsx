import EmptyState from '../../components/shared/EmptyState';

export default function QuizzesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quizzes</h1>
      <EmptyState
        title="No quizzes available"
        description="Quizzes will appear here when your teacher creates them"
      />
    </div>
  );
}
