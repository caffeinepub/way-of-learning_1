import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Class } from '../../backend';
import { Users, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ClassCardProps {
  classData: Class;
}

export default function ClassCard({ classData }: ClassCardProps) {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(classData.enrollmentCode);
    toast.success('Enrollment code copied!');
  };

  const handleViewClass = () => {
    window.location.hash = `#/teacher/class/${classData.id}`;
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{classData.name}</span>
          <Button variant="ghost" size="icon" onClick={handleViewClass}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{classData.students.length} students</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded bg-muted px-2 py-1 text-sm font-mono">
            {classData.enrollmentCode}
          </code>
          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
