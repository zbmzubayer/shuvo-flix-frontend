import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader({ title }: { title: string }) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-7">
        <SidebarTrigger />
        <h1 className="font-medium">{title}</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
