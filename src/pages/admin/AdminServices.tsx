import React from 'react';
import { EventDecoratorsTable } from '@/components/admin/EventDecoratorsTable';


export default function AdminServices() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Decorators</h1>
          <p className="text-muted-foreground">Manage event decoration vendors and their services</p>
        </div>
      </div>

      <EventDecoratorsTable />
    </div>
  );
}