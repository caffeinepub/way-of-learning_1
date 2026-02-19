import { useGetAllUsers, useListApprovals } from '../../hooks/useQueries';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UserManagementPage() {
  const { data: users, isLoading } = useGetAllUsers();
  const { data: approvals } = useListApprovals();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>

      <div className="grid gap-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>{user.name}</span>
                <Badge>{user.userType}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
