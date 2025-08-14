import React from 'react';
import { AdminAuthGuard } from '@/components/auth/AdminAuthGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminThemeForm } from '@/components/admin/AdminThemeForm';

export default function AdminTheme() {
  return (
    <AdminAuthGuard>
      <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-admin-primary">App Theme Settings</h1>
            <p className="text-admin-secondary mt-2">
              Customize the visual appearance and color scheme of your application.
            </p>
          </div>

          <Card className="border-admin-border bg-admin-surface">
            <CardHeader>
              <CardTitle className="text-admin-primary">Color Configuration</CardTitle>
              <CardDescription className="text-admin-secondary">
                Manage the primary colors, text colors, and status colors for your application theme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminThemeForm />
            </CardContent>
          </Card>
        </div>
    </AdminAuthGuard>
  );
}