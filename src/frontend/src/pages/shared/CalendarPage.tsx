import { useGetSessions, useGetAssignments, useGetCallerUserProfile } from '../../hooks/useQueries';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, FileText } from 'lucide-react';

export default function CalendarPage() {
  const { data: sessions, isLoading: sessionsLoading } = useGetSessions();
  const { data: assignments, isLoading: assignmentsLoading } = useGetAssignments();
  const { data: userProfile } = useGetCallerUserProfile();

  const isLoading = sessionsLoading || assignmentsLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading calendar..." />
      </div>
    );
  }

  const upcomingEvents = [
    ...(sessions || []).map((s) => ({
      type: 'session' as const,
      title: s.title,
      date: Number(s.dateTime) / 1000000,
      id: s.id.toString(),
    })),
    ...(assignments || []).map((a) => ({
      type: 'assignment' as const,
      title: a.title,
      date: Number(a.dueDate) / 1000000,
      id: a.id.toString(),
    })),
  ].sort((a, b) => a.date - b.date);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
      </div>

      {upcomingEvents.length > 0 ? (
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <Card key={`${event.type}-${event.id}-${index}`}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`rounded-full p-3 ${event.type === 'session' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-orange-100 dark:bg-orange-900'}`}>
                  {event.type === 'session' ? (
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.type === 'session' ? 'Session' : 'Assignment Due'} •{' '}
                    {new Date(event.date).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No upcoming events"
          description="Your calendar is empty"
        />
      )}
    </div>
  );
}
