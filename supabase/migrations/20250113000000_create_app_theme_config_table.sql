-- Create app_theme_config table for storing theme configurations
CREATE TABLE IF NOT EXISTS app_theme_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_name TEXT NOT NULL,
  primary_color TEXT NOT NULL DEFAULT '#FF0080',
  primary_light TEXT NOT NULL DEFAULT '#FF66B3',
  primary_dark TEXT NOT NULL DEFAULT '#E6007A',
  secondary_color TEXT NOT NULL DEFAULT '#42A5F5',
  secondary_light TEXT NOT NULL DEFAULT '#80D0FF',
  secondary_dark TEXT NOT NULL DEFAULT '#1976D2',
  background_color TEXT NOT NULL DEFAULT '#F8F9FA',
  surface_color TEXT NOT NULL DEFAULT '#FFFFFF',
  card_color TEXT NOT NULL DEFAULT '#FFFBFE',
  text_primary_color TEXT NOT NULL DEFAULT '#212121',
  text_secondary_color TEXT NOT NULL DEFAULT '#757575',
  text_disabled_color TEXT NOT NULL DEFAULT '#BDBDBD',
  text_on_primary TEXT NOT NULL DEFAULT '#FFFFFF',
  text_on_surface TEXT NOT NULL DEFAULT '#1C1B1F',
  border_color TEXT NOT NULL DEFAULT '#E0E0E0',
  divider_color TEXT NOT NULL DEFAULT '#E0E0E0',
  shadow_color TEXT NOT NULL DEFAULT '#1A000000',
  success_color TEXT NOT NULL DEFAULT '#4CAF50',
  success_light TEXT NOT NULL DEFAULT '#81C784',
  success_dark TEXT NOT NULL DEFAULT '#388E3C',
  warning_color TEXT NOT NULL DEFAULT '#FF9800',
  warning_light TEXT NOT NULL DEFAULT '#FFB74D',
  warning_dark TEXT NOT NULL DEFAULT '#F57C00',
  error_color TEXT NOT NULL DEFAULT '#F44336',
  error_light TEXT NOT NULL DEFAULT '#EF5350',
  error_dark TEXT NOT NULL DEFAULT '#D32F2F',
  info_color TEXT NOT NULL DEFAULT '#2196F3',
  info_light TEXT NOT NULL DEFAULT '#64B5F6',
  info_dark TEXT NOT NULL DEFAULT '#1976D2',
  is_active BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policy for admin access
ALTER TABLE app_theme_config ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage theme configurations
CREATE POLICY "Admins can manage theme configurations" ON app_theme_config
  FOR ALL USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_app_theme_config_updated_at BEFORE UPDATE ON app_theme_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default theme configuration
INSERT INTO app_theme_config (
  config_name, is_active
) VALUES (
  'Default Sylonow Theme', true
) ON CONFLICT DO NOTHING;