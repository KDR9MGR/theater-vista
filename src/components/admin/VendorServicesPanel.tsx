import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Calendar, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

interface VendorService {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
  images?: string[];
  duration?: string;
  location?: string;
}

interface VendorInfo {
  id: string;
  business_name: string;
  full_name: string;
  email: string;
  phone: string;
  vendor_type: string;
  verification_status: string;
  rating: number;
  total_reviews: number;
}

interface VendorServicesPanelProps {
  vendorId: string;
  onBack: () => void;
}

export function VendorServicesPanel({ vendorId, onBack }: VendorServicesPanelProps) {
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [services, setServices] = useState<VendorService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVendorAndServices();
  }, [vendorId]);

  const fetchVendorAndServices = async () => {
    try {
      // Fetch vendor information
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select(`
          id,
          business_name,
          full_name,
          email,
          phone,
          vendor_type,
          verification_status,
          rating,
          total_reviews
        `)
        .eq('id', vendorId)
        .single();

      if (vendorError) throw vendorError;
      setVendor(vendorData);

      // Fetch vendor's services
      const { data: servicesData, error: servicesError } = await supabase
        .from('service_listings')
        .select(`
          id,
          title,
          description,
          price,
          category,
          status,
          created_at,
          updated_at,
          images,
          duration,
          location
        `)
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error fetching vendor and services:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch vendor services',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (isLoading) {
    return (
      <Card className="shadow-admin-md">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-admin-md">
      <div className="p-6 border-b border-table-border">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">
              {vendor?.business_name || 'Unknown Business'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Services by {vendor?.full_name} • {services.length} total services
            </p>
          </div>
        </div>

        {/* Vendor Info Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Total Services</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-1">{services.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Avg. Price</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {services.length > 0 
                ? formatPrice(services.reduce((sum, service) => sum + service.price, 0) / services.length)
                : '$0'
              }
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">★</span>
              <span className="text-sm font-medium text-yellow-900">Rating</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {vendor?.rating?.toFixed(1) || 'N/A'}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Status</span>
            </div>
            <Badge className={`mt-1 ${getStatusColor(vendor?.verification_status || 'unknown')} capitalize`}>
              {vendor?.verification_status || 'Unknown'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-table-header">
            <TableRow className="border-table-border">
              <TableHead className="font-medium text-foreground">Service Title</TableHead>
              <TableHead className="font-medium text-foreground">Category</TableHead>
              <TableHead className="font-medium text-foreground">Price</TableHead>
              <TableHead className="font-medium text-foreground">Duration</TableHead>
              <TableHead className="font-medium text-foreground">Status</TableHead>
              <TableHead className="font-medium text-foreground">Created</TableHead>
              <TableHead className="font-medium text-foreground w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow
                key={service.id}
                className="border-table-border hover:bg-table-row-hover transition-admin-colors"
              >
                <TableCell className="font-medium">
                  <div>
                    <span className="font-medium">{service.title}</span>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {service.category || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {formatPrice(service.price)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {service.duration || 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(service.status)} capitalize`}>
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(service.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Service
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Service
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {services.length === 0 && (
        <div className="p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">This vendor hasn't posted any services yet.</p>
        </div>
      )}
    </Card>
  );
}