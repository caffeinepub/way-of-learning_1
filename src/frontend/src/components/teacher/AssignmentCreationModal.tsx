import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateAssignment } from '../../hooks/useQueries';
import { ClassId } from '../../backend';
import { toast } from 'sonner';

interface AssignmentCreationModalProps {
  open: boolean;
  onClose: () => void;
  classId: ClassId;
}

export default function AssignmentCreationModal({ open, onClose, classId }: AssignmentCreationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState('100');
  const { mutate: createAssignment, isPending } = useCreateAssignment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createAssignment(
      {
        classId,
        title,
        description,
        dueDate: BigInt(new Date(dueDate).getTime() * 1000000),
        maxPoints: BigInt(maxPoints),
      },
      {
        onSuccess: () => {
          toast.success('Assignment created successfully!');
          setTitle('');
          setDescription('');
          setDueDate('');
          setMaxPoints('100');
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to create assignment: ' + error.message);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Essay on Climate Change"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the assignment requirements..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPoints">Maximum Points *</Label>
            <Input
              id="maxPoints"
              type="number"
              value={maxPoints}
              onChange={(e) => setMaxPoints(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
