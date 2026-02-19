import EmptyState from '../../components/shared/EmptyState';

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      <EmptyState
        title="No messages"
        description="Your conversations will appear here"
      />
    </div>
  );
}
