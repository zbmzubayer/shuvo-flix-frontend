import { Spinner } from '@/components/ui/spinner';

export default function LoadingPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <Spinner className="size-10" />
      <p className="text-lg text-muted-foreground">Loading...</p>
    </div>
  );
}
