import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLinkChild } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface LinkChildModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LinkChildModal({ open, onClose }: LinkChildModalProps) {
  const [studentId, setStudentId] = useState('');
  const { mutate: linkChild, isPending } = useLinkChild();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      toast.error('Please enter a Student ID');
      return;
    }

    linkChild(studentId, {
      onSuccess: () => {
        toast.success('Child linked successfully!');
        setStudentId('');
        onClose();
      },
      onError: (error) => {
        toast.error('Failed to link child: ' + error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Child Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID *</Label>
            <Input
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your child's Student ID"
              required
            />
            <p className="text-xs text-muted-foreground">
              Ask your child for their Student ID from their profile
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Linking...' : 'Link Child'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
