import {
  BriefcaseBusinessIcon,
  ContactIcon,
  HandshakeIcon,
  LayoutDashboard,
  NotebookPenIcon,
  RadioIcon,
} from 'lucide-react';
import Image from 'next/image';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NavUser } from '@/layouts/nav-user';
import { SidebarMenuButtonActive } from '@/layouts/sidebar-menu-button-active';

import Logo from '../../public/logo.svg';

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
    icon: BriefcaseBusinessIcon,
  },
  {
    title: 'Provider',
    url: '/provider',
    icon: RadioIcon,
  },
  {
    title: 'Dealer',
    url: '/dealer',
    icon: HandshakeIcon,
  },
  // {
  //   title: 'Settings',
  //   url: '/settings',
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center">
            <Image alt="Shuvo Flix Logo" className="size-full rounded-md" src={brand.logo} />
          </div>
          <span className="truncate font-medium">{brand.name}</span>
          <SidebarTrigger className="ml-auto sm:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton> */}
                  <SidebarMenuButtonActive icon={<item.icon />} title={item.title} url={item.url} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
