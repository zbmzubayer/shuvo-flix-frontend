import { UserCircleIcon } from 'lucide-react';
import Image, { type ImageProps } from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type UserAvatarProps = React.ComponentProps<typeof AvatarImage> &
  ImageProps & {
    classNames?: Partial<Record<'root' | 'avatarImage' | 'inputWrapper' | 'fallback', string>>;
  };

export function UserAvatar({ classNames, ...props }: UserAvatarProps) {
  return (
    <Avatar className={classNames?.root}>
      <AvatarImage asChild className={classNames?.avatarImage} src={props.src}>
        <Image {...props} />
      </AvatarImage>
      <AvatarFallback>
        <UserCircleIcon className={cn('size-6', classNames?.fallback)} />
      </AvatarFallback>
    </Avatar>
  );
}
