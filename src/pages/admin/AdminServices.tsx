import React from 'react';
import { ServiceListingsTable } from '@/components/admin/ServiceListingsTable';

export default function AdminServices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Service Listings</h1>
        <p className="text-muted-foreground">Manage service offerings, pricing, and availability</p>
      </div>
      <ServiceListingsTable />
    </div>
  );
}