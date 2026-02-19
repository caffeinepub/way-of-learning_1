import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StudyMaterial } from '../../backend';
import { FileText, Video, Download, ExternalLink } from 'lucide-react';

interface MaterialCardProps {
  material: StudyMaterial;
}

export default function MaterialCard({ material }: MaterialCardProps) {
  const isFile = material.material.__kind__ === 'file';
  const isVideoLink = material.material.__kind__ === 'videoLink';

  const handleDownload = () => {
    if (isFile && material.material.__kind__ === 'file') {
      const url = material.material.file.getDirectURL();
      window.open(url, '_blank');
    } else if (isVideoLink && material.material.__kind__ === 'videoLink') {
      window.open(material.material.videoLink, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {isFile ? <FileText className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          <span className="truncate">{material.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" className="w-full" onClick={handleDownload}>
          {isFile ? (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Link
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
