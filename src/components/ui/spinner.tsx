import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

export function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon aria-label="Loading" className={cn('size-4 animate-spin', className)} {...props} />
  );
}
