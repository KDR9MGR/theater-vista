import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Star, Users, Clock, DollarSign, Calendar, Phone, Mail, Search, Edit, Eye, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { EditPanel } from './EditPanel';

interface Vendor {
  id: string;
  business_name: string;
  full_name: string;
  email: string;
  phone: string;
  vendor_type: 'theater_provider' | 'decoration_provider';
  is_active: boolean;
  serviceCount: number;
  profile_image_url?: string;
}

interface ServiceListing {
  id: string;
  title: string;
  category: string;
  original_price: string;
  offer_price: string;
  description?: string;
  images?: string[];
  created_at: string;
}

interface PrivateTheater {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  amenities: string[];
  images: string[];
  hourly_rate: string;
  rating: string;
  total_reviews: number;
  is_active: boolean;
  approval_status: string;
  contact_name?: string;
  contact_phone?: string;
}

interface VendorDetailsPanelProps {
  vendor: Vendor;
  onBack: () => void;
}

export function VendorDetailsPanel({ vendor, onBack }: VendorDetailsPanelProps) {
  const [serviceListings, setServiceListings] = useState<ServiceListing[]>([]);
  const [filteredServiceListings, setFilteredServiceListings] = useState<ServiceListing[]>([]);
  const [privateTheaters, setPrivateTheaters] = useState<PrivateTheater[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<'service_listing' | 'private_theater' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceListing | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch service listings for all vendor types
      const { data: servicesData, error: servicesError } = await supabase
        .from('service_listings')
        .select('*')
        .eq('vendor_id', vendor.id)
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;
      setServiceListings(servicesData || []);
      setFilteredServiceListings(servicesData || []);

      // For theater providers, also try to fetch private theaters
      if (vendor.vendor_type === 'theater_provider') {
        const { data: theaterData, error: theaterError } = await supabase
          .from('private_theaters')
          .select('*')
          .eq('owner_id', vendor.id)
          .order('created_at', { ascending: false });

        if (!theaterError) {
          setPrivateTheaters(theaterData || []);
        }
      }
    } catch (err) {
      console.error('Error fetching vendor data:', err);
      setError('Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [vendor.id, vendor.vendor_type]);

  useEffect(() => {
    // Filter service listings based on search term
    const filtered = serviceListings.filter(service => 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredServiceListings(filtered);
  }, [serviceListings, searchTerm]);

  // Early returns for loading and error states
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchVendorData} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEditService = (service: ServiceListing) => {
    setEditItem(service);
    setEditType('service_listing');
  };

  const handleEditTheater = (theater: PrivateTheater) => {
    setEditItem(theater);
    setEditType('private_theater');
  };

  const handleSaveEdit = (updatedItem: any) => {
    if (editType === 'service_listing') {
      setServiceListings(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
      setFilteredServiceListings(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
    } else if (editType === 'private_theater') {
      setPrivateTheaters(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
    }
  };

  const handleCloseEdit = () => {
    setEditItem(null);
    setEditType(null);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const renderServiceListings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Service Listings ({serviceListings.length})</h3>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search services by title, category, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {filteredServiceListings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            {searchTerm ? `No services found matching "${searchTerm}"` : 'No service listings found for this vendor.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredServiceListings.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      {/* Service Image */}
                      {service.images && service.images.length > 0 ? (
                        <img 
                          src={service.images[0]} 
                          alt={service.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{service.title}</h4>
                        <Badge variant="secondary" className="mt-1">
                          {service.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedService(service)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(service.original_price)}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(service.offer_price)}
                      </span>
                    </div>
                    <div className="text-sm text-green-600">
                      {Math.round(((parseFloat(service.original_price) - parseFloat(service.offer_price)) / parseFloat(service.original_price)) * 100)}% OFF
                    </div>
                  </div>
                </div>
                
                {service.description && (
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Created: {new Date(service.created_at).toLocaleDateString()}</span>
                  <span>ID: {service.id.slice(0, 8)}...</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderPrivateTheaters = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Private Theaters ({privateTheaters.length})</h3>
      </div>
      
      {privateTheaters.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No private theaters found for this vendor.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {privateTheaters.map((theater) => (
            <Card key={theater.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{theater.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={theater.approval_status === 'approved' ? 'default' : 
                                theater.approval_status === 'pending' ? 'secondary' : 'destructive'}
                      >
                        {theater.approval_status}
                      </Badge>
                      <Badge variant={theater.is_active ? 'default' : 'secondary'}>
                        {theater.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTheater(theater)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-semibold">{theater.rating}</span>
                        <span className="text-sm text-gray-500">({theater.total_reviews})</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600 mt-1">
                        {formatPrice(theater.hourly_rate)}/hr
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{theater.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{theater.city}, {theater.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>Capacity: {theater.capacity}</span>
                  </div>
                  {theater.contact_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{theater.contact_name}</span>
                    </div>
                  )}
                  {theater.contact_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{theater.contact_phone}</span>
                    </div>
                  )}
                </div>
                
                {theater.amenities.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {theater.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{theater.address}</span>
                  <span>ID: {theater.id.slice(0, 8)}...</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendors
        </Button>
      </div>

      {/* Vendor Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              {/* Vendor Profile Image */}
              {vendor.profile_image_url ? (
                <img 
                  src={vendor.profile_image_url} 
                  alt={vendor.business_name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <CardTitle className="text-xl">{vendor.business_name}</CardTitle>
                <p className="text-gray-600">{vendor.full_name}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant={vendor.vendor_type === 'theater_provider' ? 'default' : 'secondary'}
                className="mb-2"
              >
                {vendor.vendor_type === 'theater_provider' ? 'Theater Provider' : 'Decoration Provider'}
              </Badge>
              <br />
              <Badge variant={vendor.is_active ? 'default' : 'secondary'}>
                {vendor.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{vendor.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{vendor.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{vendor.serviceCount} Services</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">ID: {vendor.id.slice(0, 8)}...</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Listings - shown for all vendor types */}
      {renderServiceListings()}
      
      {/* Private Theaters - shown only for theater providers if they have theaters */}
      {vendor.vendor_type === 'theater_provider' && privateTheaters.length > 0 && renderPrivateTheaters()}
      
      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">
                  {isEditMode ? 'Edit Service' : 'Service Details'}
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedService(null);
                    setIsEditMode(false);
                  }}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Service Images */}
                {selectedService.images && selectedService.images.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedService.images.map((image, index) => (
                        <img 
                          key={index}
                          src={image} 
                          alt={`${selectedService.title} ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Service Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input 
                      value={selectedService.title} 
                      readOnly={!isEditMode}
                      className={!isEditMode ? 'bg-gray-50' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Input 
                      value={selectedService.category} 
                      readOnly={!isEditMode}
                      className={!isEditMode ? 'bg-gray-50' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Original Price</label>
                    <Input 
                      value={selectedService.original_price} 
                      readOnly={!isEditMode}
                      className={!isEditMode ? 'bg-gray-50' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Offer Price</label>
                    <Input 
                      value={selectedService.offer_price} 
                      readOnly={!isEditMode}
                      className={!isEditMode ? 'bg-gray-50' : ''}
                    />
                  </div>
                </div>
                
                {selectedService.description && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      value={selectedService.description} 
                      readOnly={!isEditMode}
                      className={`w-full p-2 border rounded-md ${!isEditMode ? 'bg-gray-50' : ''}`}
                      rows={3}
                    />
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  <p>Service ID: {selectedService.id}</p>
                  <p>Created: {new Date(selectedService.created_at).toLocaleString()}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedService(null);
                      setIsEditMode(false);
                    }}
                  >
                    Close
                  </Button>
                  {isEditMode ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditMode(false)}
                      >
                        Cancel Edit
                      </Button>
                      <Button>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => setIsEditMode(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Service
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Panel */}
      {editItem && (
        <EditPanel
          item={editItem}
          type={editType}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  );
}

export default VendorDetailsPanel;