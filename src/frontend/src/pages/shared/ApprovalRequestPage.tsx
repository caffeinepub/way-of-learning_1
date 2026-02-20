import { useIsCallerApproved, useRequestApproval } from '../../hooks/useQueries';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ApprovalRequestPage() {
  const { data: isApproved, isLoading } = useIsCallerApproved();
  const { mutate: requestApproval, isPending } = useRequestApproval();

  const handleRequestApproval = () => {
    requestApproval(undefined, {
      onSuccess: () => {
        toast.success('Approval request submitted successfully');
      },
      onError: (error) => {
        toast.error(`Failed to request approval: ${error.message}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Checking approval status..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account Approval Required</CardTitle>
          <CardDescription>
            Your account needs to be approved by an administrator before you can access the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isApproved === false && (
            <>
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Your approval request is pending. An administrator will review your request soon.
                </AlertDescription>
              </Alert>
              <Button onClick={handleRequestApproval} disabled={isPending} className="w-full">
                {isPending ? 'Requesting...' : 'Request Approval'}
              </Button>
            </>
          )}
          {isApproved === true && (
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>Your account has been approved!</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
