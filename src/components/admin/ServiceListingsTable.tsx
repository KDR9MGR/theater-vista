import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Eye, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface ServiceListing {
  id: string;
  title: string;
  category: string;
  original_price: number;
  offer_price: number;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  vendor_id: string;
}

export function ServiceListingsTable() {
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, statusFilter, categoryFilter]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => {
        if (statusFilter === 'active') return service.is_active;
        if (statusFilter === 'inactive') return !service.is_active;
        if (statusFilter === 'featured') return service.is_featured;
        return true;
      });
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(service => service.category === categoryFilter);
    }

    setFilteredServices(filtered);
  };

  const getUniqueCategories = () => {
    const categories = services.map(service => service.category).filter(Boolean);
    return [...new Set(categories)];
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-admin-md">
      <div className="p-6 border-b border-table-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Service Listings</h2>
            <p className="text-sm text-muted-foreground">Manage service offerings and their details</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-table-header">
            <TableRow className="border-table-border">
              <TableHead className="font-medium text-foreground">Title</TableHead>
              <TableHead className="font-medium text-foreground">Category</TableHead>
              <TableHead className="font-medium text-foreground">Price</TableHead>
              <TableHead className="font-medium text-foreground">Rating</TableHead>
              <TableHead className="font-medium text-foreground">Status</TableHead>
              <TableHead className="font-medium text-foreground">Created</TableHead>
              <TableHead className="font-medium text-foreground w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow
                key={service.id}
                className="border-table-border hover:bg-table-row-hover transition-admin-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {service.title?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{service.title || 'Untitled Service'}</div>
                      {service.is_featured && (
                        <Badge className="text-xs bg-warning text-warning-foreground mt-1">Featured</Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {service.category || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {service.offer_price && service.offer_price < service.original_price ? (
                      <>
                        <span className="font-medium text-success">₹{service.offer_price}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{service.original_price}</span>
                      </>
                    ) : (
                      <span className="font-medium">₹{service.original_price || 0}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{service.rating || 0}</span>
                    <span className="text-xs text-muted-foreground">({service.reviews_count || 0})</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={service.is_active ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(service.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredServices.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No services found matching your criteria.</p>
        </div>
      )}
    </Card>
  );
}