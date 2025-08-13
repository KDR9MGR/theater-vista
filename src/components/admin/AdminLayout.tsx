import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminAuthGuard } from '../auth/AdminAuthGuard';

export function AdminLayout() {
  return (
    <AdminAuthGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-subtle">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminAuthGuard>
  );
}