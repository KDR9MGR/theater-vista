import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ThemeConfig {
  config_name: string;
  primary_color: string;
  primary_light: string;
  primary_dark: string;
  secondary_color: string;
  secondary_light: string;
  secondary_dark: string;
  background_color: string;
  surface_color: string;
  card_color: string;
  text_primary_color: string;
  text_secondary_color: string;
  text_disabled_color: string;
  text_on_primary: string;
  text_on_surface: string;
  border_color: string;
  divider_color: string;
  shadow_color: string;
  success_color: string;
  success_light: string;
  success_dark: string;
  warning_color: string;
  warning_light: string;
  warning_dark: string;
  error_color: string;
  error_light: string;
  error_dark: string;
  info_color: string;
  info_light: string;
  info_dark: string;
}

export function AdminThemeForm() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch } = useForm<ThemeConfig>();

  const fetchActiveTheme = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('app_theme_config' as any)
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        reset(data as any);
      } else {
        // Set default values if no active theme exists
        const defaultTheme: Partial<ThemeConfig> = {
          config_name: 'Default Theme',
          primary_color: '#FF0080',
          primary_light: '#FF66B3',
          primary_dark: '#E6007A',
          secondary_color: '#42A5F5',
          secondary_light: '#80D0FF',
          secondary_dark: '#1976D2',
          background_color: '#F8F9FA',
          surface_color: '#FFFFFF',
          card_color: '#FFFBFE',
          text_primary_color: '#212121',
          text_secondary_color: '#757575',
          text_disabled_color: '#BDBDBD',
          text_on_primary: '#FFFFFF',
          text_on_surface: '#1C1B1F',
          border_color: '#E0E0E0',
          divider_color: '#E0E0E0',
          shadow_color: '#1A000000',
          success_color: '#4CAF50',
          success_light: '#81C784',
          success_dark: '#388E3C',
          warning_color: '#FF9800',
          warning_light: '#FFB74D',
          warning_dark: '#F57C00',
          error_color: '#F44336',
          error_light: '#EF5350',
          error_dark: '#D32F2F',
          info_color: '#2196F3',
          info_light: '#64B5F6',
          info_dark: '#1976D2',
        };
        reset(defaultTheme);
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch theme configuration.',
        variant: 'destructive',
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchActiveTheme();
  }, []);

  const onSubmit = async (data: ThemeConfig) => {
    try {
      setLoading(true);

      // First, deactivate all existing themes
      await supabase
        .from('app_theme_config' as any)
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // Then insert or update the new theme as active
      const { error } = await supabase
        .from('app_theme_config' as any)
        .upsert({
          ...data,
          is_active: true,
          version: 1,
        } as any);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Theme configuration updated successfully.',
      });
    } catch (error) {
      console.error('Error updating theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to update theme configuration.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-admin-primary" />
      </div>
    );
  }

  const ColorInput = ({ name, label, description }: { name: keyof ThemeConfig; label: string; description?: string }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-admin-primary font-medium">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-admin-secondary">{description}</p>
      )}
      <div className="flex items-center gap-3">
        <Input
          type="color"
          {...register(name)}
          className="w-16 h-10 p-1 border-admin-border"
        />
        <Input
          type="text"
          {...register(name)}
          placeholder="#000000"
          className="flex-1 border-admin-border"
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6">
        <div>
          <Label htmlFor="config_name" className="text-admin-primary font-medium">
            Configuration Name
          </Label>
          <Input
            {...register('config_name', { required: true })}
            placeholder="Enter theme name"
            className="mt-2 border-admin-border"
          />
        </div>

        <Separator className="bg-admin-border" />

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-admin-border bg-admin-surface/50">
            <CardHeader>
              <CardTitle className="text-admin-primary text-lg">Primary Colors</CardTitle>
              <CardDescription className="text-admin-secondary">
                Main brand colors used throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorInput 
                name="primary_color" 
                label="Primary Color" 
                description="Main brand color" 
              />
              <ColorInput 
                name="primary_light" 
                label="Primary Light" 
                description="Lighter variant of primary color" 
              />
              <ColorInput 
                name="primary_dark" 
                label="Primary Dark" 
                description="Darker variant of primary color" 
              />
            </CardContent>
          </Card>

          <Card className="border-admin-border bg-admin-surface/50">
            <CardHeader>
              <CardTitle className="text-admin-primary text-lg">Secondary Colors</CardTitle>
              <CardDescription className="text-admin-secondary">
                Secondary accent colors for complementary elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorInput 
                name="secondary_color" 
                label="Secondary Color" 
                description="Secondary accent color" 
              />
              <ColorInput 
                name="secondary_light" 
                label="Secondary Light" 
                description="Lighter variant of secondary color" 
              />
              <ColorInput 
                name="secondary_dark" 
                label="Secondary Dark" 
                description="Darker variant of secondary color" 
              />
            </CardContent>
          </Card>

          <Card className="border-admin-border bg-admin-surface/50">
            <CardHeader>
              <CardTitle className="text-admin-primary text-lg">Background Colors</CardTitle>
              <CardDescription className="text-admin-secondary">
                Colors for backgrounds, surfaces, and containers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorInput 
                name="background_color" 
                label="Background Color" 
                description="Main background color" 
              />
              <ColorInput 
                name="surface_color" 
                label="Surface Color" 
                description="Color for elevated surfaces" 
              />
              <ColorInput 
                name="card_color" 
                label="Card Color" 
                description="Color for card components" 
              />
            </CardContent>
          </Card>

          <Card className="border-admin-border bg-admin-surface/50">
            <CardHeader>
              <CardTitle className="text-admin-primary text-lg">Text Colors</CardTitle>
              <CardDescription className="text-admin-secondary">
                Colors for text content and typography
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorInput 
                name="text_primary_color" 
                label="Primary Text" 
                description="Main text color" 
              />
              <ColorInput 
                name="text_secondary_color" 
                label="Secondary Text" 
                description="Secondary text color" 
              />
              <ColorInput 
                name="text_disabled_color" 
                label="Disabled Text" 
                description="Color for disabled text" 
              />
              <ColorInput 
                name="text_on_primary" 
                label="Text on Primary" 
                description="Text color on primary backgrounds" 
              />
              <ColorInput 
                name="text_on_surface" 
                label="Text on Surface" 
                description="Text color on surface backgrounds" 
              />
            </CardContent>
          </Card>

          <Card className="border-admin-border bg-admin-surface/50">
            <CardHeader>
              <CardTitle className="text-admin-primary text-lg">Status Colors</CardTitle>
              <CardDescription className="text-admin-secondary">
                Colors for success, warning, error, and info states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorInput 
                name="success_color" 
                label="Success Color" 
                description="Color for success states" 
              />
              <ColorInput 
                name="success_light" 
                label="Success Light" 
              />
              <ColorInput 
                name="success_dark" 
                label="Success Dark" 
              />
              <ColorInput 
                name="warning_color" 
                label="Warning Color" 
                description="Color for warning states" 
              />
              <ColorInput 
                name="warning_light" 
                label="Warning Light" 
              />
              <ColorInput 
                name="warning_dark" 
                label="Warning Dark" 
              />
            </CardContent>
          </Card>

          <Card className="border-admin-border bg-admin-surface/50">
            <CardHeader>
              <CardTitle className="text-admin-primary text-lg">Error & Info Colors</CardTitle>
              <CardDescription className="text-admin-secondary">
                Colors for error and informational states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorInput 
                name="error_color" 
                label="Error Color" 
                description="Color for error states" 
              />
              <ColorInput 
                name="error_light" 
                label="Error Light" 
              />
              <ColorInput 
                name="error_dark" 
                label="Error Dark" 
              />
              <ColorInput 
                name="info_color" 
                label="Info Color" 
                description="Color for info states" 
              />
              <ColorInput 
                name="info_light" 
                label="Info Light" 
              />
              <ColorInput 
                name="info_dark" 
                label="Info Dark" 
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ColorInput 
            name="border_color" 
            label="Border Color" 
            description="Color for borders and dividers" 
          />
          <ColorInput 
            name="divider_color" 
            label="Divider Color" 
            description="Color for divider lines" 
          />
          <ColorInput 
            name="shadow_color" 
            label="Shadow Color" 
            description="Color for shadows and elevation" 
          />
        </div>
      </div>

      <Separator className="bg-admin-border" />

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-admin-primary hover:bg-admin-primary/90 text-white"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Theme Configuration
        </Button>
      </div>
    </form>
  );
}