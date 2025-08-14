import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VendorDetailsPanel } from '@/components/VendorDetailsPanel';

interface EventDecorator {
  id: string;
  business_name: string;
  full_name: string;
  email: string;
  phone: string;
  vendor_type: string;
  verification_status: string;
  is_active: boolean;
  created_at: string;
  rating: number;
  total_reviews: number;
  service_count?: number;
}

export function EventDecoratorsTable() {
  const [vendors, setVendors] = useState<EventDecorator[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<EventDecorator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<EventDecorator | null>(null);
  const [showVendorDetails, setShowVendorDetails] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(filtered);
  }, [vendors, searchTerm]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      
      // First, fetch all service listings and group by vendor_id
      const { data: serviceListingsData, error: serviceListingsError } = await supabase
        .from('service_listings')
        .select('vendor_id')
        .not('vendor_id', 'is', null);
      
      if (serviceListingsError) {
        console.error('Error fetching service listings:', serviceListingsError);
        return;
      }
      
      // Group service listings by vendor_id and count them
      const serviceCounts = (serviceListingsData || []).reduce((acc, service) => {
        if (service.vendor_id) {
          acc[service.vendor_id] = (acc[service.vendor_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      
      // Get vendor IDs that have services
      const vendorIdsWithServices = Object.keys(serviceCounts);
      
      if (vendorIdsWithServices.length === 0) {
        setVendors([]);
        return;
      }
      
      // Fetch only vendors that have services (regardless of active status for admin view)
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('vendors')
        .select('*')
        .in('id', vendorIdsWithServices);

      if (vendorsError) {
        console.error('Error fetching vendors:', vendorsError);
        return;
      }

      // Map vendors with their service counts
      const vendorsWithServiceCount = (vendorsData || []).map(vendor => ({
        ...vendor,
        serviceCount: serviceCounts[vendor.id] || 0
      }));
      setVendors(vendorsWithServiceCount);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };





  const handleVendorClick = (vendor: any) => {
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
  };

  const handleBackToVendors = () => {
    setSelectedVendor(null);
    setShowVendorDetails(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="shadow-admin-md">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show vendor details panel if a vendor is selected
  if (showVendorDetails && selectedVendor) {
    return (
      <VendorDetailsPanel 
        vendor={selectedVendor} 
        onBack={handleBackToVendors}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vendors & Services</h2>
        <div className="text-sm text-gray-500">
          {filteredVendors.length} of {vendors.length} vendors
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by business name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      {filteredVendors.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">🏪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'No vendors have been registered yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleVendorClick(vendor)}
                      className="text-blue-600 hover:text-blue-900 font-medium text-left"
                    >
                      {vendor.business_name || 'N/A'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {vendor.vendor_type?.replace('_', ' ') || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {vendor.serviceCount} services
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(vendor.verification_status)
                    }`}>
                      {vendor.verification_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleVendorClick(vendor)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Services
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
}