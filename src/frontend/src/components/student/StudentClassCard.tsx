import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Class } from '../../backend';
import { ExternalLink } from 'lucide-react';

interface StudentClassCardProps {
  classData: Class;
}

export default function StudentClassCard({ classData }: StudentClassCardProps) {
  const handleViewClass = () => {
    window.location.hash = `#/student/class/${classData.id}`;
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
      <CardContent>
        <Button variant="outline" size="sm" className="w-full" onClick={handleViewClass}>
          View Class
        </Button>
      </CardContent>
    </Card>
  );
}
