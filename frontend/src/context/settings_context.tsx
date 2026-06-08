import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRequest } from '@/lib/api-Request/api-requests';

export interface Settings {
  whatsappNumber: string;
  supportEmail: string;
  supportPhone: string;
  promoMessage: string;
  promoEnabled: boolean;
  instagramLink: string;
  linkedinLink: string;
}

// Fallback values from environment variables
const fallbackSettings: Settings = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "233247413964",
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || "info@ancestraltallow.gh",
  supportPhone: import.meta.env.VITE_SUPPORT_PHONE || "+233 24 741 3964",
  promoMessage: import.meta.env.VITE_PROMO_MESSAGE || '',
  promoEnabled: import.meta.env.VITE_PROMO_ENABLED !== undefined ? import.meta.env.VITE_PROMO_ENABLED === 'true' : true,
  instagramLink: import.meta.env.VITE_INSTAGRAM_LINK || "https://www.instagram.com/outdoorscamps?igsh=MnF5YmRlbjA2YWd3",
  linkedinLink: import.meta.env.VITE_LINKEDIN_LINK || "https://linkedin.com",
};

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(fallbackSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await getRequest<Settings>('/api/settings');
      if (data) {
        setSettings({
          whatsappNumber: data.whatsappNumber || fallbackSettings.whatsappNumber,
          supportEmail: data.supportEmail || fallbackSettings.supportEmail,
          supportPhone: data.supportPhone || fallbackSettings.supportPhone,
          promoMessage: data.promoMessage || fallbackSettings.promoMessage,
          promoEnabled: data.promoEnabled !== undefined ? data.promoEnabled : fallbackSettings.promoEnabled,
          instagramLink: data.instagramLink || fallbackSettings.instagramLink,
          linkedinLink: data.linkedinLink || fallbackSettings.linkedinLink,
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings from backend, using fallbacks:', error);
      // Fallback settings are already set as the initial state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
