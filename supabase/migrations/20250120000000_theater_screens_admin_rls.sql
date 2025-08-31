-- Enable RLS on theater_screens table
ALTER TABLE theater_screens ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view all theater screens
CREATE POLICY "Admins can view all theater screens" ON theater_screens
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_settings 
      WHERE user_id = auth.uid() 
      AND is_admin = true
    )
  );

-- Policy for admins to update theater screens
CREATE POLICY "Admins can update theater screens" ON theater_screens
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_settings 
      WHERE user_id = auth.uid() 
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_settings 
      WHERE user_id = auth.uid() 
      AND is_admin = true
    )
  );

-- Policy for theater owners to view their own theater screens
CREATE POLICY "Theater owners can view their theater screens" ON theater_screens
  FOR SELECT
  USING (
    theater_id IN (
      SELECT id FROM private_theaters 
      WHERE vendor_id = auth.uid()
    )
  );

-- Policy for theater owners to update their own theater screens
CREATE POLICY "Theater owners can update their theater screens" ON theater_screens
  FOR UPDATE
  USING (
    theater_id IN (
      SELECT id FROM private_theaters 
      WHERE vendor_id = auth.uid()
    )
  )
  WITH CHECK (
    theater_id IN (
      SELECT id FROM private_theaters 
      WHERE vendor_id = auth.uid()
    )
  );

-- Policy for public to view theater screens (for booking purposes)
CREATE POLICY "Public can view theater screens" ON theater_screens
  FOR SELECT
  USING (true);