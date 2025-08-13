import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, RefreshCw } from 'lucide-react';

interface Setting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description: string;
  is_public: boolean;
}

export function AdminSettingsForm() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingChange = (settingKey: string, value: any, field: 'setting_value' | 'is_public' = 'setting_value') => {
    setSettings(prev => prev.map(setting => 
      setting.setting_key === settingKey 
        ? { ...setting, [field]: value }
        : setting
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = settings.map(setting => ({
        id: setting.id,
        setting_value: setting.setting_value,
        is_public: setting.is_public,
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('admin_settings')
          .update(update)
          .eq('id', update.id);

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingInput = (setting: Setting) => {
    const value = setting.setting_value;

    switch (setting.setting_type) {
      case 'boolean':
        return (
          <Switch
            checked={value === true || value === 'true'}
            onCheckedChange={(checked) => handleSettingChange(setting.setting_key, checked)}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.setting_key, parseFloat(e.target.value) || 0)}
            className="bg-admin-input border-admin-border"
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
            className="bg-admin-input border-admin-border"
          />
        );
      case 'phone':
        return (
          <Input
            type="tel"
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
            className="bg-admin-input border-admin-border"
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
            className="bg-admin-input border-admin-border"
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-admin-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-admin-foreground">Application Settings</h2>
          <p className="text-admin-muted">Manage system-wide settings and configurations</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchSettings}
            disabled={isLoading}
            className="border-admin-border hover:bg-admin-accent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-admin-primary hover:bg-admin-primary/90 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {settings.map((setting) => (
          <Card key={setting.id} className="border-admin-border">
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-admin-foreground font-medium">
                      {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                    {setting.description && (
                      <p className="text-sm text-admin-muted">{setting.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`public-${setting.id}`} className="text-sm text-admin-muted">
                        Public
                      </Label>
                      <Switch
                        id={`public-${setting.id}`}
                        checked={setting.is_public}
                        onCheckedChange={(checked) => handleSettingChange(setting.setting_key, checked, 'is_public')}
                      />
                    </div>
                  </div>
                </div>
                <div className="max-w-md">
                  {renderSettingInput(setting)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}