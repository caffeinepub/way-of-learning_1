import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EmptyState from '../../components/shared/EmptyState';
import LinkChildModal from '../../components/parent/LinkChildModal';

export default function ParentDashboard() {
  const [showLinkModal, setShowLinkModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <Button onClick={() => setShowLinkModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Link Child
        </Button>
      </div>

      <EmptyState
        title="No children linked"
        description="Link your child's account using their Student ID"
        action={
          <Button onClick={() => setShowLinkModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Link Child
          </Button>
        }
      />

      <LinkChildModal open={showLinkModal} onClose={() => setShowLinkModal(false)} />
    </div>
  );
}
