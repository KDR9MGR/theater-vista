-- Enable RLS on storage.objects table for service-listing-media bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for service listing owners to manage their own photos
CREATE POLICY "Service listing owners can manage their photos" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'service-listing-media' AND
    (
      -- Check if the user is the owner of the service listing
      EXISTS (
        SELECT 1 FROM service_listings sl
        WHERE sl.vendor_id = auth.uid()
        AND (
          -- Check if the file path contains the service listing ID
          name LIKE '%' || sl.id || '%' OR
          -- Or check if it's a general vendor upload
          name LIKE '%' || auth.uid()::text || '%'
        )
      )
    )
  );

-- Policy for admins to manage all photos in service-listing-media bucket
CREATE POLICY "Admins can manage all service listing photos" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'service-listing-media' AND
    EXISTS (
      SELECT 1 FROM admin_settings 
      WHERE user_id = auth.uid() 
      AND is_admin = true
    )
  );

-- Policy for public to view photos (for display purposes)
CREATE POLICY "Public can view service listing photos" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'service-listing-media'
  );

-- Ensure the service-listing-media bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'service-listing-media',
  'service-listing-media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;