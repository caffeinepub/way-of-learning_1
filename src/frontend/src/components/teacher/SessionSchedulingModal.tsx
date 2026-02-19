import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCreateSession } from '../../hooks/useQueries';
import { ClassId } from '../../backend';
import { toast } from 'sonner';

interface SessionSchedulingModalProps {
  open: boolean;
  onClose: () => void;
  classId: ClassId;
}

export default function SessionSchedulingModal({ open, onClose, classId }: SessionSchedulingModalProps) {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [videoLink, setVideoLink] = useState('');
  const [instant, setInstant] = useState(false);
  const { mutate: createSession, isPending } = useCreateSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dateTimeValue = instant ? BigInt(Date.now() * 1000000) : BigInt(new Date(dateTime).getTime() * 1000000);

    createSession(
      {
        classId,
        title,
        dateTime: dateTimeValue,
        duration: BigInt(duration),
        videoLink: videoLink || null,
        instant,
      },
      {
        onSuccess: () => {
          toast.success('Session created successfully!');
          setTitle('');
          setDateTime('');
          setDuration('60');
          setVideoLink('');
          setInstant(false);
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to create session: ' + error.message);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to React"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="instant" checked={instant} onCheckedChange={setInstant} />
            <Label htmlFor="instant">Start Instant Session</Label>
          </div>

          {!instant && (
            <div className="space-y-2">
              <Label htmlFor="dateTime">Date & Time *</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoLink">Video Link (Google Meet, Zoom, etc.)</Label>
            <Input
              id="videoLink"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
