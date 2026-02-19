import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Assignment } from '../../backend';
import { Calendar, Award, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AssignmentCardProps {
  assignment: Assignment;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const dueDate = new Date(Number(assignment.dueDate) / 1000000);
  const isOverdue = dueDate.getTime() < Date.now();
  const isDueSoon = dueDate.getTime() - Date.now() < 24 * 60 * 60 * 1000 && !isOverdue;

  const handleViewAssignment = () => {
    window.location.hash = `#/teacher/assignment/${assignment.id}`;
  };

  return (
    <Card className={isOverdue ? 'border-destructive' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="truncate">{assignment.title}</span>
          {isOverdue && <Badge variant="destructive">Overdue</Badge>}
          {isDueSoon && <Badge variant="secondary">Due Soon</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">{assignment.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{dueDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>{assignment.maxPoints.toString()} pts</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleViewAssignment}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
