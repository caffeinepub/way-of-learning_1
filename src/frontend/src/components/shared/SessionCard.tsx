import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Session } from '../../backend';
import { Calendar, Clock, Video, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  const sessionDate = new Date(Number(session.dateTime) / 1000000);
  const isUpcoming = sessionDate.getTime() > Date.now();
  const isToday = sessionDate.toDateString() === new Date().toDateString();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{session.title}</span>
          {session.instant && <Badge variant="secondary">Instant</Badge>}
          {isToday && !session.instant && <Badge>Today</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{sessionDate.toLocaleDateString()}</span>
          <Clock className="ml-2 h-4 w-4" />
          <span>{sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Duration: {session.duration.toString()} minutes
        </div>
        {session.videoLink && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={session.videoLink} target="_blank" rel="noopener noreferrer">
              <Video className="mr-2 h-4 w-4" />
              Join Session
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
