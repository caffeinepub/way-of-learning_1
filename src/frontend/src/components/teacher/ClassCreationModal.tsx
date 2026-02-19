import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateClass } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface ClassCreationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ClassCreationModal({ open, onClose }: ClassCreationModalProps) {
  const [name, setName] = useState('');
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const { mutate: createClass, isPending } = useCreateClass();

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setEnrollmentCode(code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !enrollmentCode) {
      toast.error('Please fill in all fields');
      return;
    }

    createClass(
      { name, enrollmentCode },
      {
        onSuccess: () => {
          toast.success('Class created successfully!');
          setName('');
          setEnrollmentCode('');
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to create class: ' + error.message);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., BCA 1st Sem, 10th A Section"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Enrollment Code *</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                value={enrollmentCode}
                onChange={(e) => setEnrollmentCode(e.target.value.toUpperCase())}
                placeholder="Enter or generate code"
              />
              <Button type="button" variant="outline" onClick={generateCode}>
                Generate
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Class'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
