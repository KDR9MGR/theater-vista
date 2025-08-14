import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Shield, Star, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TheaterDetails {
  id: string;
  name: string;
  contact_name: string | null;
  contact_phone: string | null;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  capacity: number;
  approval_status: string | null;
  is_active: boolean | null;
  created_at: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  hourly_rate?: number | null;
  rating?: number | null;
  total_reviews?: number | null;
  amenities?: string[] | null;
  images?: string[] | null;
  owner_id?: string | null;
}

export default function AdminTheaterDetails() {
  const { theaterId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [theater, setTheater] = useState<TheaterDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (theaterId) {
      fetchTheaterDetails();
    }
  }, [theaterId]);

  const fetchTheaterDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('private_theaters')
        .select('*')
        .eq('id', theaterId)
        .single();

      if (error) {
        console.error('Error fetching theater details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch theater details",
          variant: "destructive",
        });
        return;
      }

      setTheater(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!theater) return;

    try {
      const { error } = await supabase
        .from('private_theaters')
        .update({ approval_status: newStatus })
        .eq('id', theater.id);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update theater status",
          variant: "destructive",
        });
        return;
      }

      setTheater({ ...theater, approval_status: newStatus });
      toast({
        title: "Success",
        description: `Theater status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!theater) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Theater Not Found</h1>
        <Button onClick={() => navigate('/admin/theaters')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Theaters
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/theaters')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Theaters
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Theater Details</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleStatusUpdate('approved')}
            className="bg-green-600 hover:bg-green-700"
            disabled={theater.approval_status === 'approved'}
          >
            <Shield className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button
            onClick={() => handleStatusUpdate('rejected')}
            variant="destructive"
            disabled={theater.approval_status === 'rejected'}
          >
            Reject
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={theater.images?.[0]} alt={theater.name} />
                <AvatarFallback className="text-lg">
                  {theater.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{theater.name}</h2>
                  <Badge className={getStatusColor(theater.approval_status || 'pending')}>
                    {theater.approval_status || 'pending'}
                  </Badge>
                </div>
                <p className="text-gray-600 mt-1">Owner: {theater.contact_name || 'N/A'}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{theater.capacity} seats</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Joined {new Date(theater.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {theater.description && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{theater.description}</p>
                </div>
              </>
            )}
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">Email not available</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">{theater.contact_phone || 'N/A'}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div className="text-gray-600">
                  <p>{theater.address}</p>
                  <p>{theater.city}, {theater.state} - {theater.pin_code}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Approval Status:</span>
                <Badge className={getStatusColor(theater.approval_status || 'pending')}>
                  {theater.approval_status || 'pending'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active:</span>
                <Badge className={theater.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {theater.is_active ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Theater Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theater Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Seating Capacity:</span>
                <span className="font-medium">{theater.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{new Date(theater.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">No documents available</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}