import React, { useState, useRef } from 'react';
import { Plus, Upload, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateServiceDialogProps {
  onServiceCreated?: () => void;
}

interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  original_price: number;
  offer_price: number;
  promotional_tag: string;
  booking_notice: string;
  setup_time: string;
  customization_available: boolean;
  customization_note: string;
  is_featured: boolean;
  decoration_type: string;
  theme_tags: string[];
  inclusions: string[];
  pincodes: string[];
  venue_types: string[];
  service_environment: string[];
}

const CATEGORIES = [
  'Birthday Decoration',
  'Anniversary Decoration',
  'Wedding Decoration',
  'Corporate Event',
  'Baby Shower',
  'Housewarming',
  'Festival Decoration',
  'Other'
];

const VENUE_TYPES = [
  'Home',
  'Hotel',
  'Restaurant',
  'Banquet Hall',
  'Outdoor',
  'Office',
  'Other'
];

const SERVICE_ENVIRONMENTS = [
  'Indoor',
  'Outdoor',
  'Both'
];

const DECORATION_TYPES = [
  'inside',
  'outside',
  'both'
];

export function CreateServiceDialog({ onServiceCreated }: CreateServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [currentInclusion, setCurrentInclusion] = useState('');
  const [currentPincode, setCurrentPincode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    category: '',
    original_price: 0,
    offer_price: 0,
    promotional_tag: '',
    booking_notice: '',
    setup_time: '',
    customization_available: false,
    customization_note: '',
    is_featured: false,
    decoration_type: 'inside',
    theme_tags: [],
    inclusions: [],
    pincodes: [],
    venue_types: [],
    service_environment: []
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `service-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size should be less than 5MB',
        variant: 'destructive'
      });
      return;
    }

    setUploadingImages(true);
    const url = await uploadImage(file);
    if (url) {
      setCoverPhoto(url);
      toast({
        title: 'Success',
        description: 'Cover photo uploaded successfully'
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to upload cover photo',
        variant: 'destructive'
      });
    }
    setUploadingImages(false);
  };

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (photos.length + files.length > 10) {
      toast({
        title: 'Error',
        description: 'Maximum 10 photos allowed',
        variant: 'destructive'
      });
      return;
    }

    setUploadingImages(true);
    const uploadPromises = files.map(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: `${file.name} is too large. Maximum size is 5MB`,
          variant: 'destructive'
        });
        return Promise.resolve(null);
      }
      return uploadImage(file);
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter(url => url !== null) as string[];
    
    if (validUrls.length > 0) {
      setPhotos(prev => [...prev, ...validUrls]);
      toast({
        title: 'Success',
        description: `${validUrls.length} photo(s) uploaded successfully`
      });
    }
    setUploadingImages(false);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.theme_tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        theme_tags: [...prev.theme_tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      theme_tags: prev.theme_tags.filter(t => t !== tag)
    }));
  };

  const addInclusion = () => {
    if (currentInclusion.trim() && !formData.inclusions.includes(currentInclusion.trim())) {
      setFormData(prev => ({
        ...prev,
        inclusions: [...prev.inclusions, currentInclusion.trim()]
      }));
      setCurrentInclusion('');
    }
  };

  const removeInclusion = (inclusion: string) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter(i => i !== inclusion)
    }));
  };

  const addPincode = () => {
    if (currentPincode.trim() && !formData.pincodes.includes(currentPincode.trim())) {
      setFormData(prev => ({
        ...prev,
        pincodes: [...prev.pincodes, currentPincode.trim()]
      }));
      setCurrentPincode('');
    }
  };

  const removePincode = (pincode: string) => {
    setFormData(prev => ({
      ...prev,
      pincodes: prev.pincodes.filter(p => p !== pincode)
    }));
  };

  const toggleVenueType = (venueType: string) => {
    setFormData(prev => ({
      ...prev,
      venue_types: prev.venue_types.includes(venueType)
        ? prev.venue_types.filter(v => v !== venueType)
        : [...prev.venue_types, venueType]
    }));
  };

  const toggleServiceEnvironment = (environment: string) => {
    setFormData(prev => ({
      ...prev,
      service_environment: prev.service_environment.includes(environment)
        ? prev.service_environment.filter(e => e !== environment)
        : [...prev.service_environment, environment]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Service title is required',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: 'Error',
        description: 'Please select a category',
        variant: 'destructive'
      });
      return;
    }

    if (formData.original_price <= 0) {
      toast({
        title: 'Error',
        description: 'Original price must be greater than 0',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // For admin creation, we'll use a default vendor_id or create a system vendor
      // In a real scenario, you might want to select a vendor or create as system admin
      const serviceData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        original_price: formData.original_price,
        offer_price: formData.offer_price > 0 ? formData.offer_price : null,
        promotional_tag: formData.promotional_tag.trim() || null,
        booking_notice: formData.booking_notice.trim() || null,
        setup_time: formData.setup_time.trim() || null,
        customization_available: formData.customization_available,
        customization_note: formData.customization_note.trim() || null,
        is_featured: formData.is_featured,
        decoration_type: formData.decoration_type,
        theme_tags: formData.theme_tags.length > 0 ? formData.theme_tags : null,
        inclusions: formData.inclusions.length > 0 ? formData.inclusions : null,
        pincodes: formData.pincodes.length > 0 ? formData.pincodes : null,
        venue_types: formData.venue_types.length > 0 ? formData.venue_types : null,
        service_environment: formData.service_environment.length > 0 ? formData.service_environment : null,
        cover_photo: coverPhoto,
        photos: photos.length > 0 ? photos : null,
        is_active: true,
        vendor_id: null // Admin created services don't need vendor_id
      };

      const { error } = await supabase
        .from('service_listings')
        .insert([serviceData]);

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message || 'Failed to create service');
      }

      toast({
        title: 'Success',
        description: 'Service created successfully'
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        original_price: 0,
        offer_price: 0,
        promotional_tag: '',
        booking_notice: '',
        setup_time: '',
        customization_available: false,
        customization_note: '',
        is_featured: false,
        decoration_type: 'inside',
        theme_tags: [],
        inclusions: [],
        pincodes: [],
        venue_types: [],
        service_environment: []
      });
      setCoverPhoto(null);
      setPhotos([]);
      setOpen(false);
      
      if (onServiceCreated) {
        onServiceCreated();
      }
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create service. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
          <DialogDescription>
            Add a new service listing with all the necessary details and images.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter service title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your service..."
              rows={3}
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="original_price">Original Price (₹) *</Label>
              <Input
                id="original_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="offer_price">Offer Price (₹)</Label>
              <Input
                id="offer_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.offer_price}
                onChange={(e) => setFormData(prev => ({ ...prev, offer_price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="promotional_tag">Promotional Tag</Label>
              <Input
                id="promotional_tag"
                value={formData.promotional_tag}
                onChange={(e) => setFormData(prev => ({ ...prev, promotional_tag: e.target.value }))}
                placeholder="e.g., Best Seller, Limited Time"
              />
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking_notice">Booking Notice</Label>
              <Input
                id="booking_notice"
                value={formData.booking_notice}
                onChange={(e) => setFormData(prev => ({ ...prev, booking_notice: e.target.value }))}
                placeholder="e.g., 24 hours advance booking required"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="setup_time">Setup Time</Label>
              <Input
                id="setup_time"
                value={formData.setup_time}
                onChange={(e) => setFormData(prev => ({ ...prev, setup_time: e.target.value }))}
                placeholder="e.g., 2-3 hours"
              />
            </div>
          </div>

          {/* Decoration Type */}
          <div className="space-y-2">
            <Label>Decoration Type</Label>
            <Select
              value={formData.decoration_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, decoration_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DECORATION_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="customization_available"
                checked={formData.customization_available}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, customization_available: checked }))}
              />
              <Label htmlFor="customization_available">Customization Available</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="is_featured">Featured Service</Label>
            </div>
          </div>

          {formData.customization_available && (
            <div className="space-y-2">
              <Label htmlFor="customization_note">Customization Note</Label>
              <Textarea
                id="customization_note"
                value={formData.customization_note}
                onChange={(e) => setFormData(prev => ({ ...prev, customization_note: e.target.value }))}
                placeholder="Describe customization options..."
                rows={2}
              />
            </div>
          )}

          {/* Theme Tags */}
          <div className="space-y-2">
            <Label>Theme Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add theme tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.theme_tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-2">
            <Label>Inclusions</Label>
            <div className="flex gap-2">
              <Input
                value={currentInclusion}
                onChange={(e) => setCurrentInclusion(e.target.value)}
                placeholder="Add inclusion"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
              />
              <Button type="button" onClick={addInclusion} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.inclusions.map(inclusion => (
                <Badge key={inclusion} variant="secondary" className="flex items-center gap-1">
                  {inclusion}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeInclusion(inclusion)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Pincodes */}
          <div className="space-y-2">
            <Label>Service Pincodes</Label>
            <div className="flex gap-2">
              <Input
                value={currentPincode}
                onChange={(e) => setCurrentPincode(e.target.value)}
                placeholder="Add pincode"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPincode())}
              />
              <Button type="button" onClick={addPincode} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.pincodes.map(pincode => (
                <Badge key={pincode} variant="secondary" className="flex items-center gap-1">
                  {pincode}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removePincode(pincode)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Venue Types */}
          <div className="space-y-2">
            <Label>Venue Types</Label>
            <div className="flex flex-wrap gap-2">
              {VENUE_TYPES.map(venueType => (
                <Badge
                  key={venueType}
                  variant={formData.venue_types.includes(venueType) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleVenueType(venueType)}
                >
                  {venueType}
                </Badge>
              ))}
            </div>
          </div>

          {/* Service Environment */}
          <div className="space-y-2">
            <Label>Service Environment</Label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_ENVIRONMENTS.map(environment => (
                <Badge
                  key={environment}
                  variant={formData.service_environment.includes(environment) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleServiceEnvironment(environment)}
                >
                  {environment}
                </Badge>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Photo</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingImages}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImages ? 'Uploading...' : 'Upload Cover Photo'}
                </Button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPhotoUpload}
                  className="hidden"
                />
              </div>
              {coverPhoto && (
                <Card className="p-2 w-32 h-32">
                  <img
                    src={coverPhoto}
                    alt="Cover"
                    className="w-full h-full object-cover rounded"
                  />
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <Label>Additional Photos (Max 10)</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImages || photos.length >= 10}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImages ? 'Uploading...' : 'Upload Photos'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotosUpload}
                  className="hidden"
                />
                <span className="text-sm text-muted-foreground">
                  {photos.length}/10 photos
                </span>
              </div>
              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {photos.map((photo, index) => (
                    <Card key={index} className="relative p-1">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 w-6 h-6"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploadingImages}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Service'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}