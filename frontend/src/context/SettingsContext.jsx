import { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/endpoints';

const SettingsContext = createContext(null);

const defaultSettings = {
  business_name: 'TUTY RO Purifier',
  tagline: 'Pure Water. Healthy Life.',
  phone: '+91 98765 43210',
  whatsapp_number: '919876543210',
  email: 'info@tutyroPurifier.com',
  address: 'Thoothukudi, Tamil Nadu',
  business_hours: 'Mon–Sat: 9:00 AM – 7:00 PM',
  google_maps_link: '',
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  logo_url: '',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsAPI.get()
      .then(res => setSettings({ ...defaultSettings, ...res.data.data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const refreshSettings = async () => {
    try {
      const res = await settingsAPI.get();
      setSettings({ ...defaultSettings, ...res.data.data });
    } catch {}
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
