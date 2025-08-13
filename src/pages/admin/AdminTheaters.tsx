import React from 'react';
import { TheatersTable } from '@/components/admin/TheatersTable';

export default function AdminTheaters() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Private Theaters</h1>
        <p className="text-muted-foreground">Manage theater listings, approval status, and capacity details</p>
      </div>
      <TheatersTable />
    </div>
  );
}