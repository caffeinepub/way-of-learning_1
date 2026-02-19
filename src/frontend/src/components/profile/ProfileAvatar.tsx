import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '../../backend';
import { User } from 'lucide-react';

interface ProfileAvatarProps {
  profile: UserProfile | null | undefined;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProfileAvatar({ profile, size = 'md' }: ProfileAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-24 w-24',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-12 w-12',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const imageUrl = profile?.profilePhoto?.getDirectURL();

  return (
    <Avatar className={sizeClasses[size]}>
      {imageUrl && <AvatarImage src={imageUrl} alt={profile?.name} />}
      <AvatarFallback>
        {profile?.name ? getInitials(profile.name) : <User className={iconSizes[size]} />}
      </AvatarFallback>
    </Avatar>
  );
}
