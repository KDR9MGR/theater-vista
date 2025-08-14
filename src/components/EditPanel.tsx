import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ServiceListing {
  id: string;
  title: string;
  category: string;
  original_price: number;
  offer_price: number;
  description: string;
  images: string[];
  vendor_id: string;
  is_active: boolean;
  approval_status: string;
  created_at: string;
}

interface PrivateTheater {
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
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  hourly_rate: number | null;
  rating: number | null;
  total_reviews: number | null;
  amenities: string[] | null;
  images: string[] | null;
  owner_id: string | null;
  advance_booking_days: number | null;
  allowed_capacity: number | null;
  booking_duration_hours: number | null;
  cancellation_policy: string | null;
  admin_notes: string | null;
  approved_at: string | null;
  available_time_slots: any;
  booking_terms: string | null;
  cancellation_deadline_hours: number | null;
  cleaning_fee: number | null;
  deposit_amount: number | null;
  discount_percentage: number | null;
  facilities: string[] | null;
  max_advance_booking_days: number | null;
  min_booking_duration: number | null;
  original_hourly_price: number | null;
  security_deposit: number | null;
  special_offers: string | null;
  updated_at: string | null;
  vendor_id: string | null;
}

type EditableItem = ServiceListing | PrivateTheater;

interface EditPanelProps {
  item: EditableItem;
  type: 'service_listing' | 'private_theater';
  onClose: () => void;
  onSave: (updatedItem: EditableItem) => void;
}

export function EditPanel({ item, type, onClose, onSave }: EditPanelProps) {
  const [formData, setFormData] = useState<EditableItem>(item);
  const [loading, setSaving] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: 'images' | 'amenities' | 'facilities', value: string) => {
    if (!value.trim()) return;
    
    const currentArray = (formData as any)[field] || [];
    setFormData(prev => ({
      ...prev,
      [field]: [...currentArray, value.trim()]
    }));
    
    if (field === 'images') setNewImage('');
    if (field === 'amenities') setNewAmenity('');
    if (field === 'facilities') setNewFacility('');
  };

  const handleArrayRemove = (field: 'images' | 'amenities' | 'facilities', index: number) => {
    const currentArray = (formData as any)[field] || [];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tableName = type === 'service_listing' ? 'service_listings' : 'private_theaters';
      
      const { error } = await supabase
        .from(tableName)
        .update(formData)
        .eq('id', formData.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${type === 'service_listing' ? 'Service listing' : 'Private theater'} updated successfully`,
      });
      
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const renderServiceListingFields = () => {
    const service = formData as ServiceListing;
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={service.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={service.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="original_price">Original Price</Label>
            <Input
              id="original_price"
              type="number"
              value={service.original_price}
              onChange={(e) => handleInputChange('original_price', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="offer_price">Offer Price</Label>
            <Input
              id="offer_price"
              type="number"
              value={service.offer_price}
              onChange={(e) => handleInputChange('offer_price', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={service.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={service.is_active}
            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        <div>
          <Label htmlFor="approval_status">Approval Status</Label>
          <Select
            value={service.approval_status}
            onValueChange={(value) => handleInputChange('approval_status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </>
    );
  };

  const renderPrivateTheaterFields = () => {
    const theater = formData as PrivateTheater;
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Theater Name</Label>
            <Input
              id="name"
              value={theater.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="contact_name">Contact Name</Label>
            <Input
              id="contact_name"
              value={theater.contact_name || ''}
              onChange={(e) => handleInputChange('contact_name', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input
              id="contact_phone"
              value={theater.contact_phone || ''}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pin_code">PIN Code</Label>
            <Input
              id="pin_code"
              value={theater.pin_code}
              onChange={(e) => handleInputChange('pin_code', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={theater.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={theater.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={theater.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={theater.capacity}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="hourly_rate">Hourly Rate</Label>
            <Input
              id="hourly_rate"
              type="number"
              value={theater.hourly_rate || ''}
              onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="original_hourly_price">Original Hourly Price</Label>
            <Input
              id="original_hourly_price"
              type="number"
              value={theater.original_hourly_price || ''}
              onChange={(e) => handleInputChange('original_hourly_price', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={theater.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={theater.latitude || ''}
              onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={theater.longitude || ''}
              onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="advance_booking_days">Advance Booking Days</Label>
            <Input
              id="advance_booking_days"
              type="number"
              value={theater.advance_booking_days || ''}
              onChange={(e) => handleInputChange('advance_booking_days', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="booking_duration_hours">Booking Duration Hours</Label>
            <Input
              id="booking_duration_hours"
              type="number"
              value={theater.booking_duration_hours || ''}
              onChange={(e) => handleInputChange('booking_duration_hours', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="min_booking_duration">Min Booking Duration</Label>
            <Input
              id="min_booking_duration"
              type="number"
              value={theater.min_booking_duration || ''}
              onChange={(e) => handleInputChange('min_booking_duration', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cleaning_fee">Cleaning Fee</Label>
            <Input
              id="cleaning_fee"
              type="number"
              value={theater.cleaning_fee || ''}
              onChange={(e) => handleInputChange('cleaning_fee', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="security_deposit">Security Deposit</Label>
            <Input
              id="security_deposit"
              type="number"
              value={theater.security_deposit || ''}
              onChange={(e) => handleInputChange('security_deposit', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
          <Textarea
            id="cancellation_policy"
            value={theater.cancellation_policy || ''}
            onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="admin_notes">Admin Notes</Label>
          <Textarea
            id="admin_notes"
            value={theater.admin_notes || ''}
            onChange={(e) => handleInputChange('admin_notes', e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={theater.is_active || false}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="approval_status">Approval Status</Label>
          <Select
            value={theater.approval_status || 'pending'}
            onValueChange={(value) => handleInputChange('approval_status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amenities Section */}
        <div>
          <Label>Amenities</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add amenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleArrayAdd('amenities', newAmenity)}
              />
              <Button
                type="button"
                onClick={() => handleArrayAdd('amenities', newAmenity)}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(theater.amenities || []).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {amenity}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleArrayRemove('amenities', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        <div>
          <Label>Facilities</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add facility"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleArrayAdd('facilities', newFacility)}
              />
              <Button
                type="button"
                onClick={() => handleArrayAdd('facilities', newFacility)}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(theater.facilities || []).map((facility, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {facility}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleArrayRemove('facilities', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Edit {type === 'service_listing' ? 'Service Listing' : 'Private Theater'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[80vh] overflow-y-auto">
        {type === 'service_listing' ? renderServiceListingFields() : renderPrivateTheaterFields()}
        
        {/* Images Section - Common for both types */}
        <div>
          <Label>Images</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add image URL"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleArrayAdd('images', newImage)}
              />
              <Button
                type="button"
                onClick={() => handleArrayAdd('images', newImage)}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {((formData as any).images || []).map((image: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.png';
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleArrayRemove('images', index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EditPanel;