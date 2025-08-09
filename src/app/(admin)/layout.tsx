import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/layouts/app-sidebar';

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-3 flex-1">{children}</main>
    </SidebarProvider>
  );
}
