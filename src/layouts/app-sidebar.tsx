import { ContactIcon, LayoutDashboard, NotebookPenIcon, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavUser } from '@/layouts/nav-user';

import Logo from '../../public/vercel.svg';

// Menu items.
const brand = {
  name: 'Shuvo Flix',
  logo: Logo,
};

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Order',
    url: '/order',
    icon: NotebookPenIcon,
  },
  {
    title: 'Customer',
    url: '/customer',
    icon: ContactIcon,
  },
  {
    title: 'Service',
    url: '/service',
    icon: ContactIcon,
  },
  {
    title: 'Provider',
    url: '/provider',
    icon: ContactIcon,
  },
  {
    title: 'Dealer',
    url: '/dealer',
    icon: ContactIcon,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-neutral-700 text-primary-foreground">
            <Image alt="Shuvo Flix Logo" className="size-4" src={brand.logo} />
          </div>
          <span className="truncate font-medium">{brand.name}</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
