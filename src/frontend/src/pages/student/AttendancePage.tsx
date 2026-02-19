import { useGetAttendanceRecords } from '../../hooks/useQueries';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AttendancePage() {
  const { data: records, isLoading } = useGetAttendanceRecords();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading attendance..." />
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <EmptyState
          title="No attendance records"
          description="Your attendance records will appear here"
        />
      </div>
    );
  }

  const presentCount = records.filter((r) => r.status === 'present').length;
  const attendancePercentage = ((presentCount / records.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Attendance</h1>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">{attendancePercentage}%</div>
          <p className="text-sm text-muted-foreground">
            {presentCount} present out of {records.length} sessions
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {records.map((record) => {
          const date = new Date(Number(record.entryTime) / 1000000);
          const statusIcon =
            record.status === 'present' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : record.status === 'late' ? (
              <Clock className="h-5 w-5 text-amber-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            );

          return (
            <Card key={record.attendanceId.toString()}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{date.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcon}
                    <Badge
                      variant={
                        record.status === 'present'
                          ? 'default'
                          : record.status === 'late'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
