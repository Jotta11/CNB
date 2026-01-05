import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  updated_at: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const settingsMap: Record<string, string | null> = {};
      (data as SiteSetting[]).forEach((setting) => {
        settingsMap[setting.key] = setting.value;
      });

      setSettings(settingsMap);
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (key: string, value: string | null) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('key', key);

    if (error) throw error;
    await fetchSettings();
  };

  return { settings, loading, error, fetchSettings, updateSetting };
};
