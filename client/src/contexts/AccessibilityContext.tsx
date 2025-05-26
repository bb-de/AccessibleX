import React, { createContext, useCallback, useEffect, useState } from 'react';
import { AccessibilityProfileId, AccessibilitySettings, Language } from '@/types/accessibility';
import { translations } from '@/data/translations';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Default accessibility settings
const defaultSettings: AccessibilitySettings = {
  textSize: 0,
  lineHeight: 0,
  letterSpacing: 0,
  contrastMode: 'default',
  darkMode: false,
  monochromeFilter: false,
  colorSaturation: 0,
  highlightLinks: false,
  highlightTitles: false,
  stopAnimations: false,
  hideImages: false,
  readingMask: false,
  readingGuide: false,
  fontFamily: 'default',
  wordSpacing: 0,
  textAlign: 'default',
  
  keyboardNavigation: false,
  highlightFocus: false,
  customCursor: false,
  cursorSize: 'default',
  cursorColor: 'black',
  virtualKeyboard: false,
  pageStructure: false,
};

interface AccessibilityContextType {
  isOpen: boolean;
  toggleWidget: () => void;
  closeWidget: () => void;
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => void;
  incrementSetting: (key: keyof Pick<AccessibilitySettings, 'textSize' | 'lineHeight' | 'letterSpacing'>) => void;
  decrementSetting: (key: keyof Pick<AccessibilitySettings, 'textSize' | 'lineHeight' | 'letterSpacing'>) => void;
  resetSettings: () => void;
  applyProfile: (profileId: AccessibilityProfileId, closeWidget?: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: typeof translations['en'];
  applyAccessibilityChanges: () => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [language, setLanguage] = useState<Language>('en');
  const { toast } = useToast();

  // Load saved settings on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    const savedLanguage = localStorage.getItem('accessibility-language');
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved accessibility settings', error);
      }
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage as Language);
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Send settings to parent window if in iframe
    const urlParams = new URLSearchParams(window.location.search);
    const isEmbedMode = urlParams.get('embed') === 'true';
    
    if (isEmbedMode && window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'accessibility-settings-change',
        settings: settings
      }, '*');
    }
  }, [settings]);

  // Save language when it changes
  useEffect(() => {
    localStorage.setItem('accessibility-language', language);
  }, [language]);

  // Toggle widget visibility
  const toggleWidget = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  // Close widget
  const closeWidget = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Update a single setting
  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
    
    // Save analytics data
    try {
      apiRequest('POST', '/api/analytics/setting-change', {
        setting: key,
        value,
      });
    } catch (error) {
      console.error('Failed to log setting change', error);
    }
  }, []);

  // Increment numeric settings
  const incrementSetting = useCallback((
    key: keyof Pick<AccessibilitySettings, 'textSize' | 'lineHeight' | 'letterSpacing'>
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: Math.min((prevSettings[key] as number) + 1, 5),
    }));
  }, []);

  // Decrement numeric settings
  const decrementSetting = useCallback((
    key: keyof Pick<AccessibilitySettings, 'textSize' | 'lineHeight' | 'letterSpacing'>
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: Math.max((prevSettings[key] as number) - 1, -5),
    }));
  }, []);

  // Apply a predefined profile
  const applyProfile = useCallback((profileId: AccessibilityProfileId, closeWidget: boolean = false) => {
    // First reset to default settings
    const defaultSettingsCopy = { ...defaultSettings };
    
    // Then apply profile-specific settings
    const profileSettings: Partial<AccessibilitySettings> = (() => {
      switch (profileId) {
        case 'visionImpaired':
          return {
            textSize: 1,                   // Ein Schritt vergrößerte Schrift
            contrastMode: 'increased',     // Erhöhter Kontrast 
            fontFamily: 'readable',        // Lesbare Schrift
            textAlign: 'left',             // Linksbündiger Text
          };
        case 'cognitiveDisability':
          return {
            fontFamily: 'readable',
            lineHeight: 2,
            wordSpacing: 30,
            textAlign: 'left',
            highlightTitles: true,
            hideImages: false,
          };
        case 'senior':
          return {
            textSize: 2,
            contrastMode: 'increased',
            fontFamily: 'readable',
            highlightFocus: true,
            highlightLinks: true,
          };
        case 'motorImpaired':
          return {
            keyboardNavigation: true,
            highlightFocus: true,
            customCursor: true,
            cursorSize: 'biggest',
            cursorColor: 'black',
          };
        case 'adhdFriendly':
          return {
            readingMask: true,
            stopAnimations: true,
            highlightFocus: true,
            // hideImages entfernt, damit Icons im ADHS-Modus sichtbar bleiben
          };
        case 'dyslexiaFriendly':
          return {
            fontFamily: 'dyslexic',
            lineHeight: 1,
            letterSpacing: 2,
            textAlign: 'left',
            readingGuide: true,
          };
        default:
          return {};
      }
    })();
    
    // Apply the new settings
    const newSettings = { ...defaultSettingsCopy, ...profileSettings };
    setSettings(newSettings);
    
    if (closeWidget) {
      setIsOpen(false);
    }
    
    toast({
      title: translations[language].profileApplied,
      description: translations[language].profileDescription,
    });
  }, [language, toast]);

  // Reset all settings to default
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    toast({
      title: translations[language].settingsReset,
      description: translations[language].settingsResetDescription,
    });
  }, [language, toast]);

  const applyAccessibilityChanges = useCallback(() => {
    // This function is called to apply changes
    // The actual application happens in the useEffect above
  }, []);

  const contextValue: AccessibilityContextType = {
    isOpen,
    toggleWidget,
    closeWidget,
    settings,
    updateSetting,
    incrementSetting,
    decrementSetting,
    resetSettings,
    applyProfile,
    language,
    setLanguage,
    translations: translations[language],
    applyAccessibilityChanges,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};
