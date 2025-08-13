import React, { useState } from 'react';
import { ServiceListingsTable } from '@/components/admin/ServiceListingsTable';
import { CreateServiceDialog } from '@/components/admin/CreateServiceDialog';

export default function AdminServices() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleServiceCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Service Listings</h1>
          <p className="text-muted-foreground">Manage service offerings, pricing, and availability</p>
        </div>
        <CreateServiceDialog onServiceCreated={handleServiceCreated} />
      </div>
      <ServiceListingsTable key={refreshKey} />
    </div>
  );
}