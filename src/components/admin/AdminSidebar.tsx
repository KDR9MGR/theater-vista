import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Building2, Users, Theater, BarChart3, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: BarChart3 },
  { title: 'Vendors', url: '/admin/vendors', icon: Users },
  { title: 'Service Listings', url: '/admin/services', icon: Building2 },
  { title: 'Private Theaters', url: '/admin/theaters', icon: Theater },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border" collapsible="icon">
      <SidebarContent className="bg-sidebar">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
              <img 
                src="/app_logo.svg" 
                alt="Logo" 
                className="w-full h-full object-contain filter invert"
              />
            </div>
          </div>
        </div>

        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider mb-3">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-admin-colors ${
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-admin-sm'
                            : 'text-sidebar-foreground hover:bg-sidebar-foreground/10'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}