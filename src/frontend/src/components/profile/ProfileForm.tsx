import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile, useGetCallerUserProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { ExternalBlob, UserProfile, UserType } from '../../backend';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

export default function ProfileForm() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profilePhotoBlob, setProfilePhotoBlob] = useState<ExternalBlob | undefined>(
    userProfile?.profilePhoto || undefined
  );

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: userProfile?.name || '',
      phoneNumber: userProfile?.phoneNumber || '',
      classSection: userProfile?.classSection || '',
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
      setUploadProgress(percentage);
    });

    setProfilePhotoBlob(blob);
    setUploadProgress(0);
  };

  const onSubmit = (data: any) => {
    if (!identity) return;

    const profile: UserProfile = {
      name: data.name,
      userType: userProfile?.userType || UserType.student,
      profilePhoto: profilePhotoBlob,
      classSection: data.classSection || undefined,
      phoneNumber: data.phoneNumber,
      id: identity.getPrincipal().toString(),
    };

    saveProfile(profile, {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
      },
      onError: (error) => {
        toast.error('Failed to update profile: ' + error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <ProfileAvatar profile={userProfile} size="lg" />
        <div>
          <Label htmlFor="photo" className="cursor-pointer">
            <div className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent">
              <Upload className="h-4 w-4" />
              Upload Photo
            </div>
          </Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <p className="mt-2 text-xs text-muted-foreground">Uploading: {uploadProgress}%</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="Enter your name"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          {...register('phoneNumber')}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="classSection">Class/Section</Label>
        <Input
          id="classSection"
          {...register('classSection')}
          placeholder="e.g., BCA 1st Sem, 10th A"
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}
