import { Spinner } from '@/components/ui/spinner';

export default function LoadingPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <Spinner />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
