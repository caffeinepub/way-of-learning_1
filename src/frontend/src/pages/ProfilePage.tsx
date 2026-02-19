import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileForm from '../components/profile/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
