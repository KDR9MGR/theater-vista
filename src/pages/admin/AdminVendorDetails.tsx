import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Shield, Star, Download, Eye, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VendorDetails {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  vendor_type: string;
  verification_status: string;
  is_active: boolean;
  created_at: string;
  business_name: string;
  profile_image_url: string;
  business_license_url: string;
  identity_verification_url: string;
  portfolio_images: any;
  bio: string;
  latitude: number;
  longitude: number;
  service_area: string;
  pincode: string;
  rating: number;
  total_reviews: number;
  total_jobs_completed: number;
  is_verified: boolean;
  is_online: boolean;
}

interface VendorDocument {
  id: string;
  vendor_id: string;
  document_type: string;
  document_url: string;
  verification_status: string;
  verified_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminVendorDetails() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [vendorDocuments, setVendorDocuments] = useState<VendorDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetails();
      fetchVendorDocuments();
    }
  }, [vendorId]);

  const fetchVendorDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (error) throw error;
      setVendor(data);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendor details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_documents')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendorDocuments(data || []);
    } catch (error) {
      console.error('Error fetching vendor documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendor documents.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theater_provider': return 'bg-info text-info-foreground';
      case 'event_planner': return 'bg-primary text-primary-foreground';
      case 'decoration_provider': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  const formatDocumentType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'identity_aadhaar_front': 'Aadhaar Card (Front)',
      'identity_aadhaar_back': 'Aadhaar Card (Back)',
      'identity_pan': 'PAN Card',
      'identity_driving_license': 'Driving License',
      'business_license': 'Business License',
      'business_registration': 'Business Registration',
      'business_gst': 'GST Certificate',
      'bank_passbook': 'Bank Passbook',
      'other': 'Other Document'
    };
    return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleDocumentVerification = async (documentId: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('vendor_documents')
        .update({
          verification_status: status,
          verified_at: status === 'verified' ? new Date().toISOString() : null,
          notes: status === 'rejected' ? 'Document rejected by admin' : null
        })
        .eq('id', documentId);

      if (error) throw error;

      // Refresh the documents list
      await fetchVendorDocuments();

      toast({
        title: "Success",
        description: `Document ${status} successfully.`,
      });
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Error",
        description: `Failed to ${status === 'verified' ? 'accept' : 'reject'} document.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/vendors')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-3 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-24 w-24 bg-muted rounded-full mx-auto"></div>
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/vendors')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Vendor Not Found</h1>
        </div>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">The requested vendor could not be found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/vendors')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{vendor.full_name}</h1>
          <p className="text-muted-foreground">Vendor Details & Documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="shadow-admin-md">
            <div className="p-6 border-b border-table-border">
              <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-foreground">{vendor.full_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                  <p className="text-foreground">{vendor.business_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">{vendor.email || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">{vendor.phone || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vendor Type</label>
                  <Badge className={`${getTypeColor(vendor.vendor_type)} capitalize`}>
                    {vendor.vendor_type?.replace('_', ' ') || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={`${getStatusColor(vendor.verification_status)} capitalize`}>
                    {vendor.verification_status}
                  </Badge>
                </div>
              </div>
              {vendor.bio && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <p className="text-foreground mt-1">{vendor.bio}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Location Information */}
          {(vendor.latitude || vendor.service_area) && (
            <Card className="shadow-admin-md">
              <div className="p-6 border-b border-table-border">
                <h2 className="text-xl font-semibold text-foreground">Location & Service Area</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendor.service_area && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Service Area</label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-foreground">{vendor.service_area}</p>
                      </div>
                    </div>
                  )}
                  {vendor.pincode && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Pincode</label>
                      <p className="text-foreground">{vendor.pincode}</p>
                    </div>
                  )}
                </div>
                
                {/* Mini Map */}
                {vendor.latitude && vendor.longitude && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Location Map</label>
                    <div className="h-48 rounded-lg overflow-hidden border border-border">
                      <iframe
                        src={`https://www.google.com/maps?q=${vendor.latitude},${vendor.longitude}&hl=en&z=15&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Documents */}
          <Card className="shadow-admin-md">
            <div className="p-6 border-b border-table-border">
              <h2 className="text-xl font-semibold text-foreground">Documents & Verification</h2>
            </div>
            <div className="p-6 space-y-4">
              {vendorDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendorDocuments.map((document) => (
                    <div key={document.id}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          {formatDocumentType(document.document_type)}
                        </label>
                        <Badge 
                          variant={document.verification_status === 'verified' ? 'default' : 
                                 document.verification_status === 'pending' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {document.verification_status}
                        </Badge>
                      </div>
                      {document.document_url ? (
                        <div className="mt-2">
                          <div className="relative group">
                            <img
                              src={document.document_url}
                              alt={formatDocumentType(document.document_type)}
                              className="w-full h-32 object-cover rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openImageInNewTab(document.document_url)}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Button size="sm" variant="secondary" onClick={() => openImageInNewTab(document.document_url)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Full Size
                              </Button>
                            </div>
                          </div>
                          {document.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{document.notes}</p>
                          )}
                          {/* Accept/Reject Buttons */}
                          {document.verification_status === 'pending' && (
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                onClick={() => handleDocumentVerification(document.id, 'verified')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1"
                                onClick={() => handleDocumentVerification(document.id, 'rejected')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground mt-1">Not uploaded</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">No documents found for this vendor.</p>
                  <p className="text-sm text-muted-foreground">Documents will appear here once uploaded to the vendor_documents table.</p>
                </div>
              )}

              {/* Portfolio Images */}
              {vendor.portfolio_images && Array.isArray(vendor.portfolio_images) && vendor.portfolio_images.length > 0 && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-muted-foreground">Portfolio Images</label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vendor.portfolio_images.map((image: string, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openImageInNewTab(image)}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button size="sm" variant="secondary" onClick={() => openImageInNewTab(image)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="shadow-admin-md">
            <div className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={vendor.profile_image_url} alt={vendor.full_name} />
                <AvatarFallback className="text-2xl">
                  {vendor.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold text-foreground">{vendor.full_name}</h3>
              <p className="text-muted-foreground capitalize">{vendor.vendor_type?.replace('_', ' ')}</p>
              
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${vendor.is_online ? 'bg-success' : 'bg-muted'}`}></div>
                <span className="text-sm text-muted-foreground">
                  {vendor.is_online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="shadow-admin-md">
            <div className="p-6 border-b border-table-border">
              <h3 className="font-semibold text-foreground">Statistics</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-medium">{vendor.rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Reviews</span>
                <span className="font-medium">{vendor.total_reviews || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Jobs Completed</span>
                <span className="font-medium">{vendor.total_jobs_completed || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account Status</span>
                <span className={`font-medium ${vendor.is_active ? 'text-success' : 'text-destructive'}`}>
                  {vendor.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </Card>

          {/* Account Info */}
          <Card className="shadow-admin-md">
            <div className="p-6 border-b border-table-border">
              <h3 className="font-semibold text-foreground">Account Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {new Date(vendor.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Verification Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Badge className={`${getStatusColor(vendor.verification_status)} capitalize`}>
                    {vendor.verification_status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}