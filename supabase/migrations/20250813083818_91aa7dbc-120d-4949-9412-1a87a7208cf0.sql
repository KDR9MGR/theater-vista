-- Create admin settings table
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  setting_type TEXT DEFAULT 'text' CHECK (setting_type IN ('text', 'number', 'boolean', 'email', 'phone')),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin full access to admin_settings" 
ON public.admin_settings 
FOR ALL 
USING (auth.uid() = '7d913fb2-24cb-4c81-b974-133251e34ab2'::uuid);

CREATE POLICY "Public can view public settings" 
ON public.admin_settings 
FOR SELECT 
USING (is_public = true);

-- Insert default settings
INSERT INTO public.admin_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('support_phone', '"1800-123-4567"', 'phone', 'Customer support phone number', true),
('support_email', '"support@theatervista.com"', 'email', 'Customer support email address', true),
('gst_rate', '18', 'number', 'GST taxation rate in percentage', false),
('app_version', '"1.0.0"', 'text', 'Current application version', true),
('maintenance_mode', 'false', 'boolean', 'Enable/disable maintenance mode', false),
('booking_lead_time_hours', '24', 'number', 'Minimum hours before booking', false),
('cancellation_fee_percentage', '10', 'number', 'Cancellation fee percentage', false),
('max_advance_booking_days', '90', 'number', 'Maximum days in advance for booking', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();