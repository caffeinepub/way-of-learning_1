import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEnrollInClass } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface ClassEnrollmentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ClassEnrollmentModal({ open, onClose }: ClassEnrollmentModalProps) {
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const { mutate: enrollInClass, isPending } = useEnrollInClass();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentCode) {
      toast.error('Please enter an enrollment code');
      return;
    }

    enrollInClass(enrollmentCode, {
      onSuccess: () => {
        toast.success('Successfully enrolled in class!');
        setEnrollmentCode('');
        onClose();
      },
      onError: (error) => {
        toast.error('Failed to enroll: ' + error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Enrollment Code *</Label>
            <Input
              id="code"
              value={enrollmentCode}
              onChange={(e) => setEnrollmentCode(e.target.value.toUpperCase())}
              placeholder="Enter class code"
              required
            />
            <p className="text-xs text-muted-foreground">
              Ask your teacher for the enrollment code
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Joining...' : 'Join Class'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
