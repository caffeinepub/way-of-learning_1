import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { UserType } from '../../backend';
import { GraduationCap, BookOpen, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RoleSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RoleSelectionModal({ open, onClose }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const { mutate: saveProfile, isPending, isError } = useSaveCallerUserProfile();
  const { identity } = useInternetIdentity();

  const roles = [
    {
      type: UserType.teacher,
      icon: GraduationCap,
      title: 'Teacher',
      description: 'Create classes, manage assignments, and track student progress',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      type: UserType.student,
      icon: BookOpen,
      title: 'Student',
      description: 'Join classes, submit assignments, and track your learning',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      type: UserType.parent,
      icon: Users,
      title: 'Parent',
      description: 'Monitor your child\'s progress and communicate with teachers',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
    },
  ];

  useEffect(() => {
    if (isPending) {
      setError(null);
      setTimeoutReached(false);
      
      const timeoutId = setTimeout(() => {
        if (isPending) {
          setTimeoutReached(true);
          setError('Profile creation is taking longer than expected. Please wait or try again.');
          console.error('[RoleSelection] Timeout reached during profile creation');
        }
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [isPending]);

  const handleContinue = () => {
    if (!selectedRole || !identity) {
      setError('Please select a role to continue');
      return;
    }

    setError(null);
    console.log('[RoleSelection] Creating profile for role:', selectedRole);

    const profile = {
      name: 'User',
      userType: selectedRole,
      profilePhoto: undefined,
      classSection: undefined,
      phoneNumber: '',
      id: identity.getPrincipal().toString(),
    };

    saveProfile(profile, {
      onSuccess: () => {
        console.log('[RoleSelection] Profile created successfully');
        toast.success('Profile created successfully!');
        onClose();
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('[RoleSelection] Profile creation failed:', errorMessage);
        setError(`Failed to create profile: ${errorMessage}`);
        toast.error('Failed to create profile. Please try again.');
      },
    });
  };

  const handleRetry = () => {
    setError(null);
    setTimeoutReached(false);
    handleContinue();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Way of Learning</DialogTitle>
          <DialogDescription>
            Please select your role to get started. You can update your profile information later.
          </DialogDescription>
        </DialogHeader>

        {(error || isError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'An error occurred while creating your profile. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4 sm:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.type;

            return (
              <button
                key={role.type}
                onClick={() => setSelectedRole(role.type)}
                disabled={isPending}
                className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`rounded-full p-4 ${role.bgColor}`}>
                  <Icon className={`h-8 w-8 ${role.color}`} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">{role.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{role.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2">
          {timeoutReached && (
            <Button onClick={handleRetry} variant="outline" disabled={isPending}>
              Retry
            </Button>
          )}
          <Button onClick={handleContinue} disabled={!selectedRole || isPending}>
            {isPending ? 'Creating Profile...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
