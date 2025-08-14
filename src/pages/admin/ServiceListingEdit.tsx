import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ServiceListingData {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  add_ons: string[];
  booking_notice: string;
  setup_time: string;
  pincodes: string[];
  venue_types: string[];
  listing_id: string;
  category: string;
  theme_tags: string[];
  cover_photo: string;
  photos: string[];
  video_url: string;
  original_price: number;
  offer_price: number;
  promotional_tag: string;
  inclusions: string[];
  customization_available: boolean;
  customization_note: string;
  is_featured: boolean;
  service_environment: string;
  vendor_id: string;
  rating: number;
  reviews_count: number;
  offers_count: number;
  decoration_type: string;
  latitude: number;
  longitude: number;
}

export function ServiceListingEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceListingData | null>(null);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [applyWatermark, setApplyWatermark] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetchServiceListing();
    }
    fetchCategories();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchServiceListing = async () => {
    try {
      const { data, error } = await supabase
        .from('service_listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setServiceData(data);
    } catch (error) {
      console.error('Error fetching service listing:', error);
      toast.error('Failed to load service listing');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!serviceData) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('service_listings')
        .update({
          ...serviceData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Service listing updated successfully');
      navigate('/admin/service-listings');
    } catch (error) {
      console.error('Error updating service listing:', error);
      toast.error('Failed to update service listing');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ServiceListingData, value: any) => {
    if (!serviceData) return;
    setServiceData({ ...serviceData, [field]: value });
  };

  const updateArrayField = (field: keyof ServiceListingData, value: string) => {
    if (!serviceData) return;
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setServiceData({ ...serviceData, [field]: array });
  };

  const applyWatermarkToImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      const watermarkImg = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        watermarkImg.onload = () => {
          // Calculate watermark size (10% of image width)
          const watermarkSize = Math.min(img.width, img.height) * 0.1;
          const x = img.width - watermarkSize - 20; // 20px margin from right
          const y = img.height - watermarkSize - 20; // 20px margin from bottom
          
          // Draw watermark with transparency
          ctx.globalAlpha = 0.7;
          ctx.drawImage(watermarkImg, x, y, watermarkSize, watermarkSize);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              const watermarkedFile = new File([blob], file.name, { type: file.type });
              resolve(watermarkedFile);
            } else {
              resolve(file);
            }
          }, file.type);
        };
        
        watermarkImg.onerror = () => {
          console.warn('Watermark not found, uploading original image');
          resolve(file);
        };
        
        watermarkImg.src = '/watermark.png';
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      let fileToUpload = file;
      
      // Apply watermark if enabled
      if (applyWatermark) {
        fileToUpload = await applyWatermarkToImage(file);
      }
      
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `service-listings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      updateField('cover_photo', publicUrl);
      toast.success('Image uploaded successfully' + (applyWatermark ? ' with watermark' : ''));
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Service Listing Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested service listing could not be found.</p>
          <Button onClick={() => navigate('/admin/service-listings')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Service Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/service-listings')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Service Listing</h1>
            <p className="text-muted-foreground">Update service details and settings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/service-listings')}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={serviceData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Service title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={serviceData.category || ''}
                  onValueChange={(value) => updateField('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={serviceData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Service description"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="vendor_id">Vendor ID</Label>
              <Input
                id="vendor_id"
                value={serviceData.vendor_id || ''}
                onChange={(e) => updateField('vendor_id', e.target.value)}
                placeholder="Vendor identifier"
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="original_price">Original Price</Label>
                <Input
                  id="original_price"
                  type="number"
                  value={serviceData.original_price || ''}
                  onChange={(e) => updateField('original_price', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="offer_price">Offer Price</Label>
                <Input
                  id="offer_price"
                  type="number"
                  value={serviceData.offer_price || ''}
                  onChange={(e) => updateField('offer_price', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="promotional_tag">Promotional Tag</Label>
                <Input
                  id="promotional_tag"
                  value={serviceData.promotional_tag || ''}
                  onChange={(e) => updateField('promotional_tag', e.target.value)}
                  placeholder="e.g., 20% OFF"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cover_photo">Cover Photo</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="cover_photo"
                    value={serviceData.cover_photo || ''}
                    onChange={(e) => updateField('cover_photo', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="watermark"
                    checked={applyWatermark}
                    onCheckedChange={setApplyWatermark}
                  />
                  <Label htmlFor="watermark" className="text-sm">Apply watermark</Label>
                </div>
                <input
                   ref={coverInputRef}
                   type="file"
                   accept="image/*"
                   className="hidden"
                   onChange={handleImageUpload}
                 />
                 {serviceData.cover_photo && (
                   <div className="mt-2">
                     <img
                       src={serviceData.cover_photo}
                       alt="Cover photo preview"
                       className="w-32 h-32 object-cover rounded-md border"
                     />
                   </div>
                 )}
               </div>
             </div>
            <div>
              <Label htmlFor="photos">Additional Photos (comma-separated URLs)</Label>
              <Textarea
                id="photos"
                value={serviceData.photos?.join(', ') || ''}
                onChange={(e) => updateArrayField('photos', e.target.value)}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                value={serviceData.video_url || ''}
                onChange={(e) => updateField('video_url', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="booking_notice">Booking Notice</Label>
                <Input
                  id="booking_notice"
                  value={serviceData.booking_notice || ''}
                  onChange={(e) => updateField('booking_notice', e.target.value)}
                  placeholder="e.g., 24 hours"
                />
              </div>
              <div>
                <Label htmlFor="setup_time">Setup Time</Label>
                <Input
                  id="setup_time"
                  value={serviceData.setup_time || ''}
                  onChange={(e) => updateField('setup_time', e.target.value)}
                  placeholder="e.g., 2 hours"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service_environment">Service Environment</Label>
                <Input
                  id="service_environment"
                  value={serviceData.service_environment || ''}
                  onChange={(e) => updateField('service_environment', e.target.value)}
                  placeholder="e.g., Indoor, Outdoor"
                />
              </div>
              <div>
                <Label htmlFor="decoration_type">Decoration Type</Label>
                <Input
                  id="decoration_type"
                  value={serviceData.decoration_type || ''}
                  onChange={(e) => updateField('decoration_type', e.target.value)}
                  placeholder="e.g., Traditional, Modern"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="inclusions">Inclusions (comma-separated)</Label>
              <Textarea
                id="inclusions"
                value={serviceData.inclusions?.join(', ') || ''}
                onChange={(e) => updateArrayField('inclusions', e.target.value)}
                placeholder="Photography, Decoration, Catering"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="add_ons">Add-ons (comma-separated)</Label>
              <Textarea
                id="add_ons"
                value={serviceData.add_ons?.join(', ') || ''}
                onChange={(e) => updateArrayField('add_ons', e.target.value)}
                placeholder="Extra lighting, Sound system"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location & Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={serviceData.latitude || ''}
                  onChange={(e) => updateField('latitude', parseFloat(e.target.value) || 0)}
                  placeholder="0.000000"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={serviceData.longitude || ''}
                  onChange={(e) => updateField('longitude', parseFloat(e.target.value) || 0)}
                  placeholder="0.000000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pincodes">Service Pincodes (comma-separated)</Label>
              <Textarea
                id="pincodes"
                value={serviceData.pincodes?.join(', ') || ''}
                onChange={(e) => updateArrayField('pincodes', e.target.value)}
                placeholder="110001, 110002, 110003"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="venue_types">Venue Types (comma-separated)</Label>
              <Textarea
                id="venue_types"
                value={serviceData.venue_types?.join(', ') || ''}
                onChange={(e) => updateArrayField('venue_types', e.target.value)}
                placeholder="Banquet Hall, Garden, Hotel"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags & Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Tags & Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme_tags">Theme Tags (comma-separated)</Label>
              <Textarea
                id="theme_tags"
                value={serviceData.theme_tags?.join(', ') || ''}
                onChange={(e) => updateArrayField('theme_tags', e.target.value)}
                placeholder="Wedding, Birthday, Corporate"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customization */}
        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="customization_available"
                checked={serviceData.customization_available || false}
                onCheckedChange={(checked) => updateField('customization_available', checked)}
              />
              <Label htmlFor="customization_available">Customization Available</Label>
            </div>
            {serviceData.customization_available && (
              <div>
                <Label htmlFor="customization_note">Customization Note</Label>
                <Textarea
                  id="customization_note"
                  value={serviceData.customization_note || ''}
                  onChange={(e) => updateField('customization_note', e.target.value)}
                  placeholder="Details about available customizations"
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status & Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={serviceData.is_active || false}
                  onCheckedChange={(checked) => updateField('is_active', checked)}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={serviceData.is_featured || false}
                  onCheckedChange={(checked) => updateField('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={serviceData.rating || ''}
                  onChange={(e) => updateField('rating', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label htmlFor="reviews_count">Reviews Count</Label>
                <Input
                  id="reviews_count"
                  type="number"
                  value={serviceData.reviews_count || ''}
                  onChange={(e) => updateField('reviews_count', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="offers_count">Offers Count</Label>
                <Input
                  id="offers_count"
                  type="number"
                  value={serviceData.offers_count || ''}
                  onChange={(e) => updateField('offers_count', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Created At</Label>
                <div className="text-sm text-muted-foreground">
                  {new Date(serviceData.created_at).toLocaleString()}
                </div>
              </div>
              <div>
                <Label>Updated At</Label>
                <div className="text-sm text-muted-foreground">
                  {new Date(serviceData.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}