import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Check, Upload, Trash2, Edit, Cake, Star, Gift, Sparkles, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'cake' | 'special_service' | 'extra-special-service' | 'decorations';
  description?: string;
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
  time_slots?: TimeSlot[];
}

export default function ScreenEdit() {
  const { theaterId, screenId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [screen, setScreen] = useState<TheaterScreen | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [addingAmenity, setAddingAmenity] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState({ start_time: '', end_time: '' });
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [activeTab, setActiveTab] = useState<'cake' | 'special_service' | 'extra-special-service' | 'decorations'>('cake');
  const [editingAddOn, setEditingAddOn] = useState<string | null>(null);
  const [newAddOn, setNewAddOn] = useState<Partial<AddOn>>({ name: '', price: 0, image: '', category: 'cake' });

  useEffect(() => {
    fetchScreenDetails();
  }, [screenId]);

  const fetchScreenDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('theater_screens')
        .select('*')
        .eq('id', screenId)
        .single();

      if (error) throw error;
      
      setScreen(data);
      
      // Set image preview if screen has images
      if (data?.images && data.images.length > 0) {
        setImagePreview(data.images[0]);
      }
      
      // Initialize time slots
      if (data?.time_slots) {
        setTimeSlots(data.time_slots);
      } else {
        // Default time slots if none exist
        const defaultSlots: TimeSlot[] = [
          { id: '1', start_time: '09:00', end_time: '12:00', is_available: true },
          { id: '2', start_time: '12:00', end_time: '15:00', is_available: true },
          { id: '3', start_time: '15:00', end_time: '18:00', is_available: true },
          { id: '4', start_time: '18:00', end_time: '21:00', is_available: true },
        ];
        setTimeSlots(defaultSlots);
      }
      
      // Initialize sample add-ons
      const sampleAddOns: AddOn[] = [
        { id: '1', name: 'Chocolate Cake', price: 25, image: '/placeholder.svg', category: 'cake', description: 'Delicious chocolate cake' },
        { id: '2', name: 'Vanilla Cake', price: 20, image: '/placeholder.svg', category: 'cake', description: 'Classic vanilla cake' },
        { id: '3', name: 'Photography Service', price: 100, image: '/placeholder.svg', category: 'special_service', description: 'Professional photography' },
        { id: '4', name: 'DJ Service', price: 150, image: '/placeholder.svg', category: 'special_service', description: 'Professional DJ service' },
        { id: '5', name: 'Premium Sound System', price: 200, image: '/placeholder.svg', category: 'extra-special-service', description: 'High-end audio equipment' },
        { id: '6', name: 'LED Lighting', price: 180, image: '/placeholder.svg', category: 'extra-special-service', description: 'Professional LED lighting setup' },
        { id: '7', name: 'Balloon Decoration', price: 50, image: '/placeholder.svg', category: 'decorations', description: 'Colorful balloon arrangements' },
        { id: '8', name: 'Flower Decoration', price: 80, image: '/placeholder.svg', category: 'decorations', description: 'Fresh flower arrangements' },
      ];
      setAddOns(sampleAddOns);
    } catch (error) {
      console.error('Error fetching screen details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load screen details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      
      if (screen) {
        setScreen({ ...screen, images: [result] });
      }
      
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!screen) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('theater_screens')
        .update({
          screen_name: screen.screen_name,
          screen_number: screen.screen_number,
          capacity: screen.capacity,
          hourly_rate: screen.hourly_rate,
          is_active: screen.is_active,
          amenities: screen.amenities,
          images: screen.images,
          total_capacity: screen.total_capacity,
          allowed_capacity: screen.allowed_capacity,
          charges_extra_per_person: screen.charges_extra_per_person,
          video_url: screen.video_url,
          original_hourly_price: screen.original_hourly_price,
          discounted_hourly_price: screen.discounted_hourly_price,
          time_slots: timeSlots,
        })
        .eq('id', screenId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Screen updated successfully',
      });
      
      navigate(`/admin/theaters/${theaterId}`);
    } catch (error) {
      console.error('Error updating screen:', error);
      toast({
        title: 'Error',
        description: 'Failed to update screen',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addAmenity = () => {
    if (!newAmenity.trim() || !screen) return;
    
    const updatedAmenities = [...(screen.amenities || []), newAmenity.trim()];
    setScreen({ ...screen, amenities: updatedAmenities });
    setNewAmenity('');
    setAddingAmenity(false);
  };

  const removeAmenity = (index: number) => {
    if (!screen) return;
    
    const updatedAmenities = screen.amenities?.filter((_, i) => i !== index) || [];
    setScreen({ ...screen, amenities: updatedAmenities });
  };

  const addTimeSlot = () => {
    if (!newTimeSlot.start_time || !newTimeSlot.end_time) return;
    
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start_time: newTimeSlot.start_time,
      end_time: newTimeSlot.end_time,
      is_available: true
    };
    
    setTimeSlots([...timeSlots, newSlot]);
    setNewTimeSlot({ start_time: '', end_time: '' });
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string | boolean) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const addNewAddOn = () => {
    if (!newAddOn.name || !newAddOn.price) return;
    
    const addOn: AddOn = {
      id: Date.now().toString(),
      name: newAddOn.name,
      price: newAddOn.price,
      image: newAddOn.image || '/placeholder.svg',
      category: newAddOn.category || 'cake',
      description: newAddOn.description
    };
    
    setAddOns([...addOns, addOn]);
    setNewAddOn({ name: '', price: 0, image: '', category: activeTab });
  };

  const updateAddOn = (id: string, field: keyof AddOn, value: string | number) => {
    setAddOns(addOns.map(addOn => 
      addOn.id === id ? { ...addOn, [field]: value } : addOn
    ));
  };

  const removeAddOn = (id: string) => {
    setAddOns(addOns.filter(addOn => addOn.id !== id));
  };

  const getTabIcon = (category: string) => {
    switch (category) {
      case 'cake': return <Cake className="h-4 w-4" />;
      case 'special_service': return <Star className="h-4 w-4" />;
      case 'extra-special-service': return <Sparkles className="h-4 w-4" />;
      case 'decorations': return <Gift className="h-4 w-4" />;
      default: return <Plus className="h-4 w-4" />;
    }
  };

  const getTabLabel = (category: string) => {
    switch (category) {
      case 'cake': return 'Cakes';
      case 'special_service': return 'Special Services';
      case 'extra-special-service': return 'Extra Special Services';
      case 'decorations': return 'Decorations';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!screen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Screen Not Found</h2>
          <p className="text-gray-600 mb-4">The requested screen could not be found.</p>
          <Button onClick={() => navigate(`/admin/theaters/${theaterId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Theater
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/theaters/${theaterId}`)}
                className="flex items-center w-fit shadow-sm hover:shadow-md transition-shadow"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Theater
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Screen</h1>
                <p className="text-sm text-gray-600 mt-1">Manage screen details and add-ons</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/theaters/${theaterId}`)}
                className="flex-1 sm:flex-none shadow-sm hover:shadow-md transition-shadow"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center flex-1 sm:flex-none shadow-sm hover:shadow-md transition-shadow"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Screen Image Section */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Screen Image</h3>
          <div className="space-y-4">
            {/* Current Image Display */}
            <div className="flex flex-col items-center space-y-4">
              {imagePreview || (screen?.images && screen.images.length > 0) ? (
                <div className="relative">
                  <img
                    src={imagePreview || (screen?.images?.[0] || '')}
                    alt="Screen preview"
                    className="w-64 h-48 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImageFile(null);
                      if (screen) {
                        setScreen({ ...screen, images: [] });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-64 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No image uploaded</p>
                  </div>
                </div>
              )}
              
              {/* Upload Button */}
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="screen-image-upload"
                />
                <Label htmlFor="screen-image-upload">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    disabled={uploadingImage}
                    asChild
                  >
                    <span>
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Basic Information */}
          <Card className="p-6 hover:shadow-md transition-shadow border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Edit className="mr-2 h-5 w-5 text-blue-600" />
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="screen_name" className="text-sm font-medium text-gray-700 mb-2 block">Screen Name</Label>
                <Input
                  id="screen_name"
                  value={screen.screen_name}
                  onChange={(e) => setScreen({ ...screen, screen_name: e.target.value })}
                  placeholder="Enter screen name"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="screen_number" className="text-sm font-medium text-gray-700 mb-2 block">Screen Number</Label>
                  <Input
                    id="screen_number"
                    type="number"
                    value={screen.screen_number}
                    onChange={(e) => setScreen({ ...screen, screen_number: parseInt(e.target.value) || 0 })}
                    placeholder="Enter screen number"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <Label htmlFor="capacity" className="text-sm font-medium text-gray-700 mb-2 block">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={screen.capacity}
                    onChange={(e) => setScreen({ ...screen, capacity: parseInt(e.target.value) || 0 })}
                    placeholder="Enter capacity"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="total_capacity" className="text-sm font-medium text-gray-700 mb-2 block">Total Capacity</Label>
                  <Input
                    id="total_capacity"
                    type="number"
                    value={screen.total_capacity || ''}
                    onChange={(e) => setScreen({ ...screen, total_capacity: parseInt(e.target.value) || undefined })}
                    placeholder="Enter total capacity"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <Label htmlFor="allowed_capacity" className="text-sm font-medium text-gray-700 mb-2 block">Allowed Capacity</Label>
                  <Input
                    id="allowed_capacity"
                    type="number"
                    value={screen.allowed_capacity || ''}
                    onChange={(e) => setScreen({ ...screen, allowed_capacity: parseInt(e.target.value) || undefined })}
                    placeholder="Enter allowed capacity"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="is_active"
                  checked={screen.is_active || false}
                  onCheckedChange={(checked) => setScreen({ ...screen, is_active: checked })}
                />
                <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</Label>
              </div>
            </div>
          </Card>

          {/* Pricing Information */}
          <Card className="p-6 hover:shadow-md transition-shadow border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-green-600">₹</span>
              Pricing Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hourly_rate" className="text-sm font-medium text-gray-700 mb-2 block">Hourly Rate (₹)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  step="0.01"
                  value={screen.hourly_rate}
                  onChange={(e) => setScreen({ ...screen, hourly_rate: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter hourly rate"
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="original_hourly_price" className="text-sm font-medium text-gray-700 mb-2 block">Original Hourly Price (₹)</Label>
                  <Input
                    id="original_hourly_price"
                    type="number"
                    step="0.01"
                    value={screen.original_hourly_price || ''}
                    onChange={(e) => setScreen({ ...screen, original_hourly_price: parseFloat(e.target.value) || undefined })}
                    placeholder="Enter original hourly price"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <Label htmlFor="discounted_hourly_price" className="text-sm font-medium text-gray-700 mb-2 block">Discounted Hourly Price (₹)</Label>
                  <Input
                    id="discounted_hourly_price"
                    type="number"
                    step="0.01"
                    value={screen.discounted_hourly_price || ''}
                    onChange={(e) => setScreen({ ...screen, discounted_hourly_price: parseFloat(e.target.value) || undefined })}
                    placeholder="Enter discounted hourly price"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="charges_extra_per_person" className="text-sm font-medium text-gray-700 mb-2 block">Extra Charges Per Person (₹)</Label>
                  <Input
                    id="charges_extra_per_person"
                    type="number"
                    step="0.01"
                    value={screen.charges_extra_per_person || ''}
                    onChange={(e) => setScreen({ ...screen, charges_extra_per_person: parseFloat(e.target.value) || undefined })}
                    placeholder="Enter extra charges per person"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <Label htmlFor="video_url" className="text-sm font-medium text-gray-700 mb-2 block">Video URL</Label>
                  <Input
                    id="video_url"
                    value={screen.video_url || ''}
                    onChange={(e) => setScreen({ ...screen, video_url: e.target.value || undefined })}
                    placeholder="Enter video URL"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </Card>

        {/* Full Width Sections */}
        <div className="space-y-6">
          {/* Time Slots */}
          <Card className="p-6 hover:shadow-md transition-shadow border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-purple-600">⏰</span>
              Time Slots
            </h3>
            <div className="space-y-4">
              {/* Existing Time Slots */}
              <div className="grid gap-4">
                {timeSlots.map((slot) => (
                  <div key={slot.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-sm transition-all">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Start Time</Label>
                        <Input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) => updateTimeSlot(slot.id, 'start_time', e.target.value)}
                          className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">End Time</Label>
                        <Input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) => updateTimeSlot(slot.id, 'end_time', e.target.value)}
                          className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={slot.is_available}
                          onCheckedChange={(checked) => updateTimeSlot(slot.id, 'is_available', checked)}
                        />
                        <Label className="text-sm font-medium text-gray-700">Available</Label>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeTimeSlot(slot.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add New Time Slot */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 border-2 border-dashed border-purple-200 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Start Time</Label>
                    <Input
                      type="time"
                      value={newTimeSlot.start_time}
                      onChange={(e) => setNewTimeSlot({ ...newTimeSlot, start_time: e.target.value })}
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">End Time</Label>
                    <Input
                      type="time"
                      value={newTimeSlot.end_time}
                      onChange={(e) => setNewTimeSlot({ ...newTimeSlot, end_time: e.target.value })}
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <Button 
                  onClick={addTimeSlot} 
                  disabled={!newTimeSlot.start_time || !newTimeSlot.end_time}
                  className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </div>
            </div>
          </Card>

          {/* Amenities */}
          <Card className="p-6 hover:shadow-md transition-shadow border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-blue-600">✨</span>
              Amenities
            </h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {screen.amenities?.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-2 px-3 py-1 text-sm hover:shadow-sm transition-shadow">
                    <span>{amenity}</span>
                    <button
                      onClick={() => removeAmenity(index)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                
                {addingAmenity ? (
                  <div className="flex items-center space-x-2 p-2 border border-blue-200 rounded-lg bg-blue-50">
                    <Input
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Enter amenity"
                      className="w-40 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                    />
                    <Button size="sm" onClick={addAmenity} className="shadow-sm hover:shadow-md transition-shadow">
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setAddingAmenity(false)} className="hover:bg-gray-100 transition-colors">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all px-3 py-1 text-sm"
                    onClick={() => setAddingAmenity(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Amenity
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Add-ons Section */}
          <Card className="p-6 hover:shadow-md transition-shadow border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Gift className="mr-2 h-5 w-5 text-pink-600" />
              Add-ons & Services
            </h3>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
              {(['cake', 'special_service', 'extra-special-service', 'decorations'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`flex items-center px-4 py-2 rounded-t-lg font-medium text-sm transition-all ${
                    activeTab === category
                      ? 'bg-white border-b-2 border-pink-500 text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {getTabIcon(category)}
                  <span className="ml-2">{getTabLabel(category)}</span>
                </button>
              ))}
            </div>

            {/* Add-ons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {addOns
                .filter(addOn => addOn.category === activeTab)
                .map((addOn) => (
                  <div key={addOn.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all bg-gradient-to-br from-white to-gray-50">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <img 
                        src={addOn.image} 
                        alt={addOn.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    
                    {editingAddOn === addOn.id ? (
                      <div className="space-y-3">
                        <Input
                          value={addOn.name}
                          onChange={(e) => updateAddOn(addOn.id, 'name', e.target.value)}
                          className="font-medium transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                        <Input
                          type="number"
                          value={addOn.price}
                          onChange={(e) => updateAddOn(addOn.id, 'price', parseFloat(e.target.value) || 0)}
                          className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                        <Input
                          value={addOn.description || ''}
                          onChange={(e) => updateAddOn(addOn.id, 'description', e.target.value)}
                          placeholder="Description"
                          className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => setEditingAddOn(null)} className="flex-1">
                            <Check className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingAddOn(null)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{addOn.name}</h4>
                        <p className="text-lg font-semibold text-green-600 mb-2">₹{addOn.price}</p>
                        {addOn.description && (
                          <p className="text-sm text-gray-600 mb-3">{addOn.description}</p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingAddOn(addOn.id)}
                            className="flex-1 hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeAddOn(addOn.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              }
            </div>

            {/* Add New Add-on */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add New {getTabLabel(activeTab).slice(0, -1)}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="Name"
                  value={newAddOn.name || ''}
                  onChange={(e) => setNewAddOn({ ...newAddOn, name: e.target.value })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Input
                  type="number"
                  placeholder="Price (₹)"
                  value={newAddOn.price || ''}
                  onChange={(e) => setNewAddOn({ ...newAddOn, price: parseFloat(e.target.value) || 0 })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Input
                  placeholder="Image URL"
                  value={newAddOn.image || ''}
                  onChange={(e) => setNewAddOn({ ...newAddOn, image: e.target.value })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Input
                  placeholder="Description"
                  value={newAddOn.description || ''}
                  onChange={(e) => setNewAddOn({ ...newAddOn, description: e.target.value })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <Button
                onClick={addNewAddOn}
                disabled={!newAddOn.name || !newAddOn.price}
                className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add {getTabLabel(activeTab).slice(0, -1)}
              </Button>
            </div>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}