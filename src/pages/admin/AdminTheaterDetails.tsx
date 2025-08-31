import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Shield, Star, Users, Building, Edit2, Check, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
  is_verified: boolean | null;
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

interface TheaterScreen {
  id: string;
  screen_name: string;
  screen_number: number;
  capacity: number;
  hourly_rate: number;
  is_active: boolean | null;
  amenities: string[] | null;
  images: string[] | null;
  theater_id: string;
  created_at: string | null;
  total_capacity?: number;
  allowed_capacity?: number;
  charges_extra_per_person?: number;
  video_url?: string;
  original_hourly_price?: number;
  discounted_hourly_price?: number;
}

interface TheaterTimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  price_per_hour: number | null;
  is_active: boolean | null;
  is_available: boolean | null;
  screen_id: string | null;
  theater_id: string;
  created_at: string | null;
  base_price?: number;
  price_multiplier?: number;
  weekday_multiplier?: number;
  weekend_multiplier?: number;
  holiday_multiplier?: number;
  max_duration_hours?: number;
  min_duration_hours?: number;
}

export default function AdminTheaterDetails() {
  const { theaterId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [theater, setTheater] = useState<TheaterDetails | null>(null);
  const [screens, setScreens] = useState<TheaterScreen[]>([]);
  const [timeSlots, setTimeSlots] = useState<TheaterTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [screensLoading, setScreensLoading] = useState(false);
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);
  const [editingScreen, setEditingScreen] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editingTimeSlot, setEditingTimeSlot] = useState<string | null>(null);
  const [editingAmenity, setEditingAmenity] = useState<string | null>(null);
  const [newAmenity, setNewAmenity] = useState<string>('');
  const [editValues, setEditValues] = useState<{[key: string]: string}>({});
  const [addOns, setAddOns] = useState<any[]>([]);
  const [editingAddOnId, setEditingAddOnId] = useState<string | null>(null);
  const [editingAddOn, setEditingAddOn] = useState<{name: string, price: number, image: string}>({name: '', price: 0, image: ''});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (theaterId) {
      fetchTheaterDetails();
      fetchTheaterScreens();
      fetchTimeSlots();
      // Load sample add-ons data
      setAddOns([
        {
          id: '1',
          name: 'Premium Sound System',
          price: 500,
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'
        },
        {
          id: '2',
          name: 'LED Lighting Package',
          price: 300,
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop'
        },
        {
          id: '3',
          name: 'Decoration Package',
          price: 200,
          image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=100&h=100&fit=crop'
        }
      ]);
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

  const fetchTheaterScreens = async () => {
    try {
      setScreensLoading(true);
      console.log('Fetching theater screens for theater ID:', theaterId);
      
      const { data, error } = await supabase
        .from('theater_screens')
        .select('*')
        .eq('theater_id', theaterId)
        .order('screen_number', { ascending: true });

      if (error) {
        console.error('Error fetching theater screens:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast({
          title: "Error",
          description: `Failed to fetch theater screens: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Theater screens fetched successfully:', data);
      setScreens(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching screens",
        variant: "destructive",
      });
    } finally {
      setScreensLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      setTimeSlotsLoading(true);
      console.log('Fetching time slots for theater ID:', theaterId);
      
      const { data, error } = await supabase
        .from('theater_time_slots')
        .select('*')
        .eq('theater_id', theaterId)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching time slots:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast({
          title: "Error",
          description: `Failed to fetch time slots: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Time slots fetched successfully:', data);
      setTimeSlots(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching time slots",
        variant: "destructive",
      });
    } finally {
      setTimeSlotsLoading(false);
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

  const handleActiveToggle = async (newActiveStatus: boolean) => {
    if (!theater) return;

    try {
      const { error } = await supabase
        .from('private_theaters')
        .update({ is_active: newActiveStatus })
        .eq('id', theater.id);

      if (error) {
        console.error('Error updating active status:', error);
        toast({
          title: "Error",
          description: "Failed to update active status",
          variant: "destructive",
        });
        return;
      }

      setTheater({ ...theater, is_active: newActiveStatus });
      toast({
        title: "Success",
        description: `Theater ${newActiveStatus ? 'activated' : 'deactivated'} successfully`,
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

  const handleVerifiedToggle = async (newVerifiedStatus: boolean) => {
    if (!theater) return;

    try {
      const { error } = await supabase
        .from('private_theaters')
        .update({ is_verified: newVerifiedStatus })
        .eq('id', theater.id);

      if (error) {
        console.error('Error updating verified status:', error);
        toast({
          title: "Error",
          description: "Failed to update verified status",
          variant: "destructive",
        });
        return;
      }

      setTheater({ ...theater, is_verified: newVerifiedStatus });
      toast({
        title: "Success",
        description: `Theater ${newVerifiedStatus ? 'verified' : 'unverified'} successfully`,
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

  const updateScreenName = async (screenId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('theater_screens')
        .update({ screen_name: newName })
        .eq('id', screenId);

      if (error) {
        console.error('Error updating screen name:', error);
        toast({
          title: "Error",
          description: "Failed to update screen name",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setScreens(screens.map(screen => 
        screen.id === screenId ? { ...screen, screen_name: newName } : screen
      ));
      
      toast({
        title: "Success",
        description: "Screen name updated successfully",
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

  const handleEditAddOn = (addOn: any) => {
    setEditingAddOnId(addOn.id);
    setEditingAddOn({
      name: addOn.name,
      price: addOn.price,
      image: addOn.image
    });
  };

  const handleSaveAddOn = async () => {
    if (!editingAddOnId) return;

    try {
      // Here you would typically update the add-on in your database
      // For now, we'll just update the local state
      setAddOns(addOns.map(addOn => 
        addOn.id === editingAddOnId 
          ? { ...addOn, ...editingAddOn }
          : addOn
      ));
      
      setEditingAddOnId(null);
      setEditingAddOn({name: '', price: 0, image: ''});
      
      toast({
        title: "Success",
        description: "Add-on updated successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update add-on",
        variant: "destructive",
      });
    }
  };

  const handleCancelEditAddOn = () => {
    setEditingAddOnId(null);
    setEditingAddOn({name: '', price: 0, image: ''});
    setSelectedImageFile(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setUploadingImage(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditingAddOn({...editingAddOn, image: result});
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImageFile(null);
    setEditingAddOn({...editingAddOn, image: ''});
  };

  const updateDiscountedPrice = async (screenId: string, newPrice: number) => {
    try {
      const { error } = await supabase
        .from('theater_screens')
        .update({ discounted_hourly_price: newPrice })
        .eq('id', screenId);

      if (error) {
        console.error('Error updating discounted price:', error);
        toast({
          title: "Error",
          description: "Failed to update discounted price",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setScreens(screens.map(screen => 
        screen.id === screenId ? { ...screen, discounted_hourly_price: newPrice } : screen
      ));
      
      toast({
        title: "Success",
        description: "Discounted price updated successfully",
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

  const handleEditStart = (screenId: string, field: 'name' | 'price', currentValue: string | number) => {
    if (field === 'name') {
      setEditingScreen(screenId);
      setEditValues({ ...editValues, [`${screenId}_name`]: currentValue.toString() });
    } else {
      setEditingPrice(screenId);
      setEditValues({ ...editValues, [`${screenId}_price`]: currentValue.toString() });
    }
  };

  const handleEditCancel = (screenId: string, field: 'name' | 'price') => {
    if (field === 'name') {
      setEditingScreen(null);
    } else {
      setEditingPrice(null);
    }
    const key = `${screenId}_${field === 'name' ? 'name' : 'price'}`;
    const newEditValues = { ...editValues };
    delete newEditValues[key];
    setEditValues(newEditValues);
  };

  const handleEditSave = async (screenId: string, field: 'name' | 'price') => {
    const key = `${screenId}_${field === 'name' ? 'name' : 'price'}`;
    const value = editValues[key];
    
    if (!value || value.trim() === '') {
      toast({
        title: "Error",
        description: "Value cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (field === 'name') {
      await updateScreenName(screenId, value.trim());
      setEditingScreen(null);
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        toast({
          title: "Error",
          description: "Please enter a valid price",
          variant: "destructive",
        });
        return;
      }
      await updateDiscountedPrice(screenId, numValue);
      setEditingPrice(null);
    }
    
    const newEditValues = { ...editValues };
    delete newEditValues[key];
    setEditValues(newEditValues);
  };

  // Time format conversion helpers
  const convertTo12Hour = (time24: string) => {
    const [hours, minutes, seconds] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const convertTo24Hour = (time12: string) => {
    const [time, ampm] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}:00`;
  };

  const updateTimeSlot = async (slotId: string, startTime: string, endTime: string) => {
    try {
      const { error } = await supabase
        .from('theater_time_slots')
        .update({ 
          start_time: convertTo24Hour(startTime),
          end_time: convertTo24Hour(endTime)
        })
        .eq('id', slotId);

      if (error) {
        console.error('Error updating time slot:', error);
        toast({
          title: "Error",
          description: "Failed to update time slot",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setTimeSlots(timeSlots.map(slot => 
        slot.id === slotId ? { 
          ...slot, 
          start_time: convertTo24Hour(startTime),
          end_time: convertTo24Hour(endTime)
        } : slot
      ));
      
      toast({
        title: "Success",
        description: "Time slot updated successfully",
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

  const handleTimeSlotEditStart = (slotId: string, startTime: string, endTime: string) => {
    setEditingTimeSlot(slotId);
    setEditValues({ 
      ...editValues, 
      [`${slotId}_start`]: convertTo12Hour(startTime),
      [`${slotId}_end`]: convertTo12Hour(endTime)
    });
  };

  const handleTimeSlotEditCancel = (slotId: string) => {
    setEditingTimeSlot(null);
    const newEditValues = { ...editValues };
    delete newEditValues[`${slotId}_start`];
    delete newEditValues[`${slotId}_end`];
    setEditValues(newEditValues);
  };

  const handleTimeSlotEditSave = async (slotId: string) => {
    const startTime = editValues[`${slotId}_start`];
    const endTime = editValues[`${slotId}_end`];
    
    if (!startTime || !endTime) {
      toast({
        title: "Error",
        description: "Both start and end times are required",
        variant: "destructive",
      });
      return;
    }

    // Validate time format
    const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      toast({
        title: "Error",
        description: "Please enter valid time format (e.g., 12:30 PM)",
        variant: "destructive",
      });
      return;
    }

    await updateTimeSlot(slotId, startTime, endTime);
    setEditingTimeSlot(null);
    
    const newEditValues = { ...editValues };
    delete newEditValues[`${slotId}_start`];
    delete newEditValues[`${slotId}_end`];
    setEditValues(newEditValues);
  };

  const addAmenity = async (screenId: string, amenity: string) => {
    if (!amenity.trim()) {
      toast({
        title: "Error",
        description: "Amenity name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const screen = screens.find(s => s.id === screenId);
      if (!screen) return;

      const currentAmenities = screen.amenities || [];
      const updatedAmenities = [...currentAmenities, amenity.trim()];

      const { error } = await supabase
        .from('theater_screens')
        .update({ amenities: updatedAmenities })
        .eq('id', screenId);

      if (error) {
        console.error('Error adding amenity:', error);
        toast({
          title: "Error",
          description: "Failed to add amenity",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setScreens(screens.map(s => 
        s.id === screenId ? { ...s, amenities: updatedAmenities } : s
      ));
      
      setNewAmenity('');
      setEditingAmenity(null);
      
      toast({
        title: "Success",
        description: "Amenity added successfully",
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

  const removeAmenity = async (screenId: string, amenityIndex: number) => {
    try {
      const screen = screens.find(s => s.id === screenId);
      if (!screen || !screen.amenities) return;

      const updatedAmenities = screen.amenities.filter((_, index) => index !== amenityIndex);

      const { error } = await supabase
        .from('theater_screens')
        .update({ amenities: updatedAmenities })
        .eq('id', screenId);

      if (error) {
        console.error('Error removing amenity:', error);
        toast({
          title: "Error",
          description: "Failed to remove amenity",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setScreens(screens.map(s => 
        s.id === screenId ? { ...s, amenities: updatedAmenities } : s
      ));
      
      toast({
        title: "Success",
        description: "Amenity removed successfully",
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

  const handleAddAmenityStart = (screenId: string) => {
    setEditingAmenity(screenId);
    setNewAmenity('');
  };

  const handleAddAmenityCancel = () => {
    setEditingAmenity(null);
    setNewAmenity('');
  };

  const handleAddAmenitySave = async (screenId: string) => {
    await addAmenity(screenId, newAmenity);
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

          {/* Theater Screens Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theater Screens</h3>
            {screensLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : screens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {screens.map((screen) => (
                  <div key={screen.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {editingScreen === screen.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editValues[`${screen.id}_name`] || ''}
                              onChange={(e) => setEditValues({ ...editValues, [`${screen.id}_name`]: e.target.value })}
                              className="h-8 text-sm font-semibold"
                              placeholder="Screen name"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditSave(screen.id, 'name')}
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCancel(screen.id, 'name')}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{screen.screen_name}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStart(screen.id, 'name', screen.screen_name)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Screen #{screen.screen_number}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Capacity:</span>
                        <span className="font-medium">{screen.capacity} seats</span>
                      </div>
                    
                      <div className="flex justify-between items-center">
                        <span>Discounted Rate:</span>
                        {editingPrice === screen.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={editValues[`${screen.id}_price`] || ''}
                              onChange={(e) => setEditValues({ ...editValues, [`${screen.id}_price`]: e.target.value })}
                              className="h-6 w-20 text-xs"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditSave(screen.id, 'price')}
                              className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCancel(screen.id, 'price')}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {screen.discounted_hourly_price ? `₹${screen.discounted_hourly_price}` : 'Not set'}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStart(screen.id, 'price', screen.discounted_hourly_price || 0)}
                              className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="h-2 w-2" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="block mb-1">Amenities:</span>
                        <div className="flex flex-wrap gap-1">
                          {screen.amenities && screen.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs group relative">
                              {amenity}
                              <button
                                onClick={() => removeAmenity(screen.id, index)}
                                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                title="Remove amenity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          {editingAmenity === screen.id ? (
                            <div className="flex items-center gap-1">
                              <Input
                                value={newAmenity}
                                onChange={(e) => setNewAmenity(e.target.value)}
                                placeholder="Enter amenity"
                                className="h-6 text-xs w-24"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddAmenitySave(screen.id);
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddAmenitySave(screen.id)}
                                className="h-6 px-2"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleAddAmenityCancel}
                                className="h-6 px-2"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-gray-100 border-dashed"
                              onClick={() => handleAddAmenityStart(screen.id)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Amenity
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No screens found for this theater.</p>
            )}
          </Card>

          {/* Time Slots Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Slots</h3>
            {timeSlotsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : timeSlots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {timeSlots.map((slot) => {
                  const screenName = screens.find(s => s.id === slot.screen_id)?.screen_name || 'Unknown Screen';
                  const isEditing = editingTimeSlot === slot.id;
                  return (
                    <div key={slot.id} className="bg-white border rounded p-3 group">
                      <div className="flex items-center justify-between mb-2">
                        {isEditing ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <Input
                              value={editValues[`${slot.id}_start`] || ''}
                              onChange={(e) => setEditValues({
                                ...editValues,
                                [`${slot.id}_start`]: e.target.value
                              })}
                              placeholder="12:30 PM"
                              className="text-sm h-8 w-20"
                            />
                            <span className="text-sm">-</span>
                            <Input
                              value={editValues[`${slot.id}_end`] || ''}
                              onChange={(e) => setEditValues({
                                ...editValues,
                                [`${slot.id}_end`]: e.target.value
                              })}
                              placeholder="3:30 PM"
                              className="text-sm h-8 w-20"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTimeSlotEditSave(slot.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTimeSlotEditCancel(slot.id)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {convertTo12Hour(slot.start_time)} - {convertTo12Hour(slot.end_time)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTimeSlotEditStart(slot.id, slot.start_time, slot.end_time)}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <Badge className={slot.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {slot.is_available ? 'Available' : 'Booked'}
                        </Badge>
                      </div>
                     
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No time slots found for this theater.</p>
            )}
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
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active:</span>
                <Switch
                  checked={theater.is_active || false}
                  onCheckedChange={handleActiveToggle}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Verified:</span>
                <Switch
                  checked={theater.is_verified || false}
                  onCheckedChange={handleVerifiedToggle}
                />
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

          {/* Theater Owner Add-ons */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theater Owner Add-ons</h3>
            <div className="space-y-4">
              {addOns.length === 0 ? (
                <p className="text-gray-600 text-sm">No add-ons available</p>
              ) : (
                addOns.map((addOn) => (
                  <div key={addOn.id} className="border rounded-lg p-4">
                    {editingAddOnId === addOn.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {editingAddOn.image && (
                              <div className="relative inline-block">
                                <img 
                                  src={editingAddOn.image} 
                                  alt="Preview" 
                                  className="w-20 h-20 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={removeSelectedImage}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            )}
                            {uploadingImage && (
                              <p className="text-sm text-gray-500">Uploading image...</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <Input
                            value={editingAddOn.name}
                            onChange={(e) => setEditingAddOn({...editingAddOn, name: e.target.value})}
                            placeholder="Enter add-on name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                          <Input
                            type="number"
                            value={editingAddOn.price}
                            onChange={(e) => setEditingAddOn({...editingAddOn, price: parseFloat(e.target.value) || 0})}
                            placeholder="Enter price"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveAddOn} size="sm">
                            Save
                          </Button>
                          <Button onClick={handleCancelEditAddOn} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {addOn.image ? (
                            <img src={addOn.image} alt={addOn.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs">No Image</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{addOn.name}</h4>
                          <p className="text-gray-600">₹{addOn.price}</p>
                        </div>
                        <Button onClick={() => handleEditAddOn(addOn)} variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
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