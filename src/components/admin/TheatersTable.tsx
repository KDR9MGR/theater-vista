import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, Eye, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface PrivateTheater {
  id: string;
  name: string;
  city: string;
  state: string;
  capacity: number;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  approval_status: string;
  is_active: boolean;
  created_at: string;
  amenities: string[];
}

export function TheatersTable() {
  const [theaters, setTheaters] = useState<PrivateTheater[]>([]);
  const [filteredTheaters, setFilteredTheaters] = useState<PrivateTheater[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTheaters();
  }, []);

  const handleVerificationToggle = async (theaterId: string, isApproved: boolean) => {
    try {
      const newStatus = isApproved ? 'approved' : 'pending';
      
      const { error } = await supabase
        .from('private_theaters')
        .update({ approval_status: newStatus })
        .eq('id', theaterId);

      if (error) throw error;

      // Update local state
      setTheaters(prev => prev.map(theater => 
        theater.id === theaterId 
          ? { ...theater, approval_status: newStatus }
          : theater
      ));

      toast({
        title: "Success",
        description: `Theater ${isApproved ? 'approved' : 'unapproved'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating theater approval:', error);
      toast({
        title: "Error",
        description: "Failed to update theater approval status.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    filterTheaters();
  }, [theaters, searchTerm, statusFilter]);

  const fetchTheaters = async () => {
    try {
      const { data, error } = await supabase
        .from('private_theaters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTheaters(data || []);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTheaters = () => {
    let filtered = theaters;

    if (searchTerm) {
      filtered = filtered.filter(theater =>
        theater.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theater.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theater.state?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(theater => theater.approval_status === statusFilter);
    }

    setFilteredTheaters(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
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
            <h2 className="text-xl font-semibold text-foreground">Private Theaters</h2>
            <p className="text-sm text-muted-foreground">Manage theater listings and approval status</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search theaters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-table-header">
            <TableRow className="border-table-border">
              <TableHead className="font-medium text-foreground">Theater</TableHead>
              <TableHead className="font-medium text-foreground">Location</TableHead>
              <TableHead className="font-medium text-foreground">Capacity</TableHead>
              <TableHead className="font-medium text-foreground">Rate/Hour</TableHead>
              <TableHead className="font-medium text-foreground">Rating</TableHead>
              <TableHead className="font-medium text-foreground">Status</TableHead>
              <TableHead className="font-medium text-foreground">Verified</TableHead>
              <TableHead className="font-medium text-foreground">Created</TableHead>
              <TableHead className="font-medium text-foreground w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTheaters.map((theater) => (
              <TableRow
                key={theater.id}
                className="border-table-border hover:bg-table-row-hover transition-admin-colors cursor-pointer"
                onClick={() => navigate(`/admin/theaters/${theater.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {theater.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{theater.name || 'Unnamed Theater'}</div>
                      {theater.amenities && theater.amenities.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {theater.amenities.slice(0, 2).join(', ')}
                          {theater.amenities.length > 2 && ' +' + (theater.amenities.length - 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm">{theater.city}, {theater.state}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{theater.capacity} people</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">₹{theater.hourly_rate || 0}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{theater.rating || 0}</span>
                    <span className="text-xs text-muted-foreground">({theater.total_reviews || 0})</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(theater.approval_status)} capitalize`}>
                    {theater.approval_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={theater.approval_status === 'approved'}
                      onCheckedChange={(checked) => handleVerificationToggle(theater.id, checked)}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(theater.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/theaters/${theater.id}`);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTheaters.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No theaters found matching your criteria.</p>
        </div>
      )}
    </Card>
  );
}