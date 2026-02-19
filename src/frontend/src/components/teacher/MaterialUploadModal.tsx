import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUploadStudyMaterial } from '../../hooks/useQueries';
import { ClassId, ExternalBlob } from '../../backend';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface MaterialUploadModalProps {
  open: boolean;
  onClose: () => void;
  classId: ClassId;
}

export default function MaterialUploadModal({ open, onClose, classId }: MaterialUploadModalProps) {
  const [name, setName] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileBlob, setFileBlob] = useState<ExternalBlob | null>(null);
  const { mutate: uploadMaterial, isPending } = useUploadStudyMaterial();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
      setUploadProgress(percentage);
    });

    setFileBlob(blob);
    if (!name) setName(file.name);
    setUploadProgress(0);
  };

  const handleSubmit = (type: 'file' | 'link') => {
    if (!name) {
      toast.error('Please enter a material name');
      return;
    }

    const material = type === 'file'
      ? { __kind__: 'file' as const, file: fileBlob! }
      : { __kind__: 'videoLink' as const, videoLink };

    uploadMaterial(
      { classId, name, material },
      {
        onSuccess: () => {
          toast.success('Material uploaded successfully!');
          setName('');
          setVideoLink('');
          setFileBlob(null);
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to upload material: ' + error.message);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Study Material</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="file">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="link">Video Link</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileName">Material Name *</Label>
              <Input
                id="fileName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Chapter 1 Notes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">File *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                />
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <p className="text-xs text-muted-foreground">Uploading: {uploadProgress}%</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => handleSubmit('file')} disabled={!fileBlob || isPending}>
                {isPending ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkName">Material Name *</Label>
              <Input
                id="linkName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Lecture Recording"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoLink">Video Link *</Label>
              <Input
                id="videoLink"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => handleSubmit('link')} disabled={!videoLink || isPending}>
                {isPending ? 'Adding...' : 'Add Link'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
