import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload, ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [applyWatermark, setApplyWatermark] = useState(true);
  const [watermarkPosition, setWatermarkPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'>('bottom-right');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const addPhotoInputRef = useRef<HTMLInputElement>(null);
  const [replacingPhotoIndex, setReplacingPhotoIndex] = useState<number | null>(null);

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
      navigate('/admin/services');
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
          const margin = 20;
          
          // Calculate position based on watermarkPosition
          let x, y;
          switch (watermarkPosition) {
            case 'top-left':
              x = margin;
              y = margin;
              break;
            case 'top-right':
              x = img.width - watermarkSize - margin;
              y = margin;
              break;
            case 'bottom-left':
              x = margin;
              y = img.height - watermarkSize - margin;
              break;
            case 'bottom-right':
              x = img.width - watermarkSize - margin;
              y = img.height - watermarkSize - margin;
              break;
            case 'center':
              x = (img.width - watermarkSize) / 2;
              y = (img.height - watermarkSize) / 2;
              break;
            default:
              x = img.width - watermarkSize - margin;
              y = img.height - watermarkSize - margin;
          }
          
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
        
        watermarkImg.src = '/app_logo.svg';
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      let fileToUpload = file;
      
      // Apply watermark if enabled
      if (applyWatermark) {
        try {
          fileToUpload = await applyWatermarkToImage(file);
          console.log('Watermark applied successfully');
        } catch (watermarkError) {
          console.warn('Watermark application failed, using original image:', watermarkError);
          toast.warning('Watermark could not be applied, uploading original image');
        }
      }
      
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `image_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${serviceData?.vendor_id || 'admin'}/service-media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-listing-media')
        .upload(filePath, fileToUpload);

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('service-listing-media')
        .getPublicUrl(filePath);

      updateField('cover_photo', publicUrl);
      toast.success(`Image uploaded successfully${applyWatermark ? ' with watermark' : ''}`);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDownloadPhoto = async (photoUrl: string, index: number) => {
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `photo_${index + 1}_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Photo downloaded successfully');
    } catch (error) {
      console.error('Error downloading photo:', error);
      toast.error('Failed to download photo');
    }
  };

  const handleReplacePhoto = (index: number) => {
    setReplacingPhotoIndex(index);
    photoInputRef.current?.click();
  };

  const handleAddPhoto = () => {
    addPhotoInputRef.current?.click();
  };

  const handleAddPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      let fileToUpload = file;
      
      // Apply watermark if enabled
      if (applyWatermark) {
        try {
          fileToUpload = await applyWatermarkToImage(file);
          console.log('Watermark applied successfully');
        } catch (watermarkError) {
          console.warn('Watermark application failed, using original image:', watermarkError);
          toast.warning('Watermark could not be applied, uploading original image');
        }
      }
      
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `image_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${serviceData?.vendor_id || 'admin'}/service-media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-listing-media')
        .upload(filePath, fileToUpload);

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('service-listing-media')
        .getPublicUrl(filePath);

      // Add the new photo to the photos array
      const currentPhotos = serviceData?.photos || [];
      updateField('photos', [...currentPhotos, publicUrl]);
      
      toast.success(`Photo added successfully${applyWatermark ? ' with watermark' : ''}`);
    } catch (error: any) {
      console.error('Error adding photo:', error);
      toast.error(error.message || 'Failed to add photo. Please try again.');
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handlePhotoReplacement = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || replacingPhotoIndex === null) return;

    // File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      let fileToUpload = file;
      
      // Apply watermark if enabled
      if (applyWatermark) {
        try {
          fileToUpload = await applyWatermarkToImage(file);
          console.log('Watermark applied successfully');
        } catch (watermarkError) {
          console.warn('Watermark application failed, using original image:', watermarkError);
          toast.warning('Watermark could not be applied, uploading original image');
        }
      }
      
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `image_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${serviceData?.vendor_id || 'admin'}/service-media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-listing-media')
        .upload(filePath, fileToUpload);

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('service-listing-media')
        .getPublicUrl(filePath);

      // Replace the photo at the specific index
      const newPhotos = [...(serviceData?.photos || [])];
      newPhotos[replacingPhotoIndex] = publicUrl;
      updateField('photos', newPhotos);
      
      toast.success(`Photo replaced successfully${applyWatermark ? ' with watermark' : ''}`);
    } catch (error: any) {
      console.error('Error replacing photo:', error);
      toast.error(error.message || 'Failed to replace photo. Please try again.');
    } finally {
      setUploadingImage(false);
      setReplacingPhotoIndex(null);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
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
        {/* Essential Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Service Details</CardTitle>
            <p className="text-sm text-muted-foreground">Edit the main service information</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-base font-medium">Category *</Label>
              <Select
                value={serviceData.category || ''}
                onValueChange={(value) => updateField('category', value)}
              >
                <SelectTrigger className="mt-1">
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

            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-base font-medium">Service Title *</Label>
              <Input
                id="title"
                value={serviceData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Enter service title"
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-base font-medium">Description *</Label>
              <Textarea
                id="description"
                value={serviceData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe your service in detail"
                rows={4}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pricing</CardTitle>
            <p className="text-sm text-muted-foreground">Set competitive pricing for your service</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="original_price" className="text-base font-medium">Original Price *</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="original_price"
                    type="number"
                    value={serviceData.original_price || ''}
                    onChange={(e) => updateField('original_price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="offer_price" className="text-base font-medium">Offer Price</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="offer_price"
                    type="number"
                    value={serviceData.offer_price || ''}
                    onChange={(e) => updateField('offer_price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Leave empty if no discount</p>
              </div>
            </div>
            {(serviceData.original_price && serviceData.offer_price && serviceData.offer_price < serviceData.original_price) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  Discount: ₹{serviceData.original_price - serviceData.offer_price} 
                  ({Math.round(((serviceData.original_price - serviceData.offer_price) / serviceData.original_price) * 100)}% off)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Media & Photos</CardTitle>
            <p className="text-sm text-muted-foreground">Upload and manage service images</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cover Photo */}
            <div>
              <Label htmlFor="cover_photo" className="text-base font-medium">Cover Photo *</Label>
              <div className="mt-2 space-y-4">
                {/* Watermark Settings */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="watermark"
                        checked={applyWatermark}
                        onCheckedChange={setApplyWatermark}
                      />
                      <Label htmlFor="watermark" className="text-sm font-medium">Apply brand watermark</Label>
                    </div>
                    <Badge variant={applyWatermark ? "default" : "secondary"}>
                      {applyWatermark ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  
                  {applyWatermark && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Watermark Position</Label>
                      <select
                        value={watermarkPosition}
                        onChange={(e) => setWatermarkPosition(e.target.value as any)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="center">Center</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Upload Section with Drag & Drop */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                    const files = Array.from(e.dataTransfer.files);
                    const imageFile = files.find(file => file.type.startsWith('image/'));
                    if (imageFile) {
                      handleImageUpload({ target: { files: [imageFile] } } as any);
                    }
                  }}
                >
                  {serviceData.cover_photo ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <img
                          src={serviceData.cover_photo}
                          alt="Cover photo preview"
                          className="w-full max-w-md mx-auto h-48 object-cover rounded-lg border shadow-sm"
                        />
                        {applyWatermark && (
                          <div 
                            className={`absolute pointer-events-none ${
                              watermarkPosition === 'top-left' ? 'top-2 left-2' :
                              watermarkPosition === 'top-right' ? 'top-2 right-2' :
                              watermarkPosition === 'bottom-left' ? 'bottom-2 left-2' :
                              watermarkPosition === 'bottom-right' ? 'bottom-2 right-2' :
                              watermarkPosition === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
                              'bottom-2 right-2'
                            }`}
                          >
                            <img
                              src="/app_logo.svg"
                              alt="Watermark preview"
                              className="w-8 h-8 opacity-70"
                              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
                            />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Badge variant="secondary" className="text-xs">
                            Admin Override Available
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center flex-wrap">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => coverInputRef.current?.click()}
                          disabled={uploadingImage}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingImage ? 'Uploading...' : 'Replace Photo'}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to remove this cover photo? This action cannot be undone.')) {
                              updateField('cover_photo', '');
                            }
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const url = prompt('Enter new image URL:', serviceData.cover_photo || '');
                            if (url && url.trim()) {
                              updateField('cover_photo', url.trim());
                            }
                          }}
                        >
                          Edit URL
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        As admin, you can override vendor-uploaded images
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium">Upload Cover Photo</p>
                        <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
                        <p className="text-xs text-muted-foreground mt-1">Supports: JPG, PNG, WebP (Max 5MB)</p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          disabled={uploadingImage}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingImage ? 'Uploading...' : 'Choose File'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const url = prompt('Or enter image URL:');
                            if (url && url.trim()) {
                              updateField('cover_photo', url.trim());
                            }
                          }}
                        >
                          Add URL
                        </Button>
                      </div>
                    </div>
                  )}
                </div>



                <input
                   ref={coverInputRef}
                   type="file"
                   accept="image/*"
                   className="hidden"
                   onChange={handleImageUpload}
                 />
               </div>
             </div>

             {/* Additional Photos Gallery */}
             <div>
               <Label className="text-base font-medium">Additional Photos</Label>
               <p className="text-sm text-muted-foreground mb-3">Manage additional service images</p>
               
               {serviceData.photos && serviceData.photos.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                   {serviceData.photos.map((photo, index) => (
                     <div key={index} className="relative group">
                       <img
                         src={photo}
                         alt={`Additional photo ${index + 1}`}
                         className="w-full h-32 object-cover rounded-lg border shadow-sm"
                       />
                       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                         <div className="flex gap-2">
                           <Button
                             type="button"
                             variant="secondary"
                             size="sm"
                             className="opacity-0 group-hover:opacity-100 transition-opacity"
                             onClick={() => handleDownloadPhoto(photo, index)}
                             title="Download photo"
                           >
                             <Download className="h-4 w-4" />
                           </Button>
                           <Button
                             type="button"
                             variant="outline"
                             size="sm"
                             className="opacity-0 group-hover:opacity-100 transition-opacity"
                             onClick={() => handleReplacePhoto(index)}
                             title="Replace photo"
                           >
                             <RefreshCw className="h-4 w-4" />
                           </Button>
                           <Button
                             type="button"
                             variant="destructive"
                             size="sm"
                             className="opacity-0 group-hover:opacity-100 transition-opacity"
                             onClick={() => {
                               const newPhotos = serviceData.photos?.filter((_, i) => i !== index) || [];
                               updateField('photos', newPhotos);
                             }}
                             title="Delete photo"
                           >
                             <X className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                   <p className="text-muted-foreground">No additional photos uploaded</p>
                 </div>
               )}
               
               <div className="flex gap-2">
                 <Button
                   type="button"
                   variant="outline"
                   onClick={handleAddPhoto}
                   disabled={uploadingImage}
                   className="flex items-center gap-2"
                 >
                   <Upload className="h-4 w-4" />
                   {uploadingImage ? 'Uploading...' : 'Add Photo'}
                 </Button>
               </div>
               
               {/* Hidden file input for photo replacement */}
               <input
                 ref={photoInputRef}
                 type="file"
                 accept="image/*"
                 onChange={handlePhotoReplacement}
                 style={{ display: 'none' }}
               />
               
               {/* Hidden file input for adding new photos */}
               <input
                 ref={addPhotoInputRef}
                 type="file"
                 accept="image/*"
                 onChange={handleAddPhotoUpload}
                 style={{ display: 'none' }}
               />
             </div>


          </CardContent>
        </Card>

        {/* Advanced Settings - Collapsible */}
        <Card>
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Advanced Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">Additional service configuration and details</p>
                  </div>
                  {showAdvanced ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Service Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium border-b pb-2">Service Details</h3>
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
                </div>

                {/* Location & Availability */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium border-b pb-2">Location & Availability</h3>
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
                </div>

                {/* Tags & Categories */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium border-b pb-2">Tags & Categories</h3>
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
                </div>

                {/* Customization */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium border-b pb-2">Customization</h3>
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
                </div>

                {/* Status & Settings */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium border-b pb-2">Status & Settings</h3>
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
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>


      </div>
    </div>
  );
}