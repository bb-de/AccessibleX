/**
 * Accessibility Widget - Vollständige Version
 * Entwickelt von Branding Brothers
 * Version 1.0.0
 */
(function() {
  'use strict';
  
  // Widget-Konfiguration
  const config = {
    position: 'right',
    language: 'de',
    theme: 'default',
    buttonSize: 50,
    zIndex: 999999
  };
  
  // Aktuelle Einstellungen (werden mit localStorage synchronisiert)
  let settings = {
    // Vision settings
    contrastMode: 'default',
    saturation: 100,
    textSize: 0,
    lineHeight: 0,
    letterSpacing: 0,
    darkMode: false,
    hideImages: false,
    stopAnimations: false,
    
    // Content settings
    highlightTitles: false,
    highlightLinks: false,
    textToSpeech: false,
    readingMask: false,
    readingGuide: false,
    fontFamily: 'default',
    wordSpacing: 0,
    textAlign: 'default',
    
    // Navigation settings
    keyboardNavigation: false,
    highlightFocus: false,
    customCursor: false,
    cursorSize: 'default',
    cursorColor: 'white',
    virtualKeyboard: false,
    pageStructure: false
  };
  
  // Widget-Zustand
  let isOpen = false;
  let activeTab = 'profiles';
  let activeProfile = null;
  let widgetContainer = null;
  let widgetButton = null;
  let widgetPanel = null;
  let styleElement = null;
  
  // Übersetzungen
  const translations = {
    de: {
      accessibilityMenu: "Barrierefreiheit-Einstellungen",
      closeAriaLabel: "Einstellungen schließen",
      reset: "Zurücksetzen",
      profiles: "Profile",
      vision: "Sehen",
      content: "Inhalt",
      navigation: "Navigation",
      accessibilityProfiles: "BARRIEREFREIHEITS-PROFILE",
      visionSettings: "SEHEINSTELLUNGEN",
      contentSettings: "INHALTSEINSTELLUNGEN",
      navigationSettings: "NAVIGATIONSHILFEN",
      textSize: "Textgröße",
      contrast: "Kontrast",
      fontFamily: "Schriftart",
      lineHeight: "Zeilenabstand",
      letterSpacing: "Buchstabenabstand",
      wordSpacing: "Wortabstand",
      textAlign: "Textausrichtung",
      standard: "Standard",
      resetSettings: "Einstellungen zurücksetzen",
      resetAllSettings: "Alle Einstellungen zurücksetzen",
      darkMode: "Dunkler Modus",
      highlightLinks: "Links hervorheben",
      highlightTitles: "Überschriften hervorheben",
      readingGuide: "Lesehilfe",
      keyboardNavigation: "Tastaturnavigation",
      readingMask: "Lesemaske",
      customCursor: "Benutzerdef. Cursor"
    },
    en: {
      accessibilityMenu: "Accessibility Settings",
      closeAriaLabel: "Close settings",
      reset: "Reset",
      profiles: "Profiles",
      vision: "Vision",
      content: "Content",
      navigation: "Navigation",
      accessibilityProfiles: "ACCESSIBILITY PROFILES",
      visionSettings: "VISION SETTINGS",
      contentSettings: "CONTENT SETTINGS",
      navigationSettings: "NAVIGATION AIDS",
      textSize: "Text Size",
      contrast: "Contrast",
      fontFamily: "Font Family",
      lineHeight: "Line Height",
      letterSpacing: "Letter Spacing",
      wordSpacing: "Word Spacing",
      textAlign: "Text Alignment",
      standard: "Default",
      resetSettings: "Reset Settings",
      resetAllSettings: "Reset All Settings",
      darkMode: "Dark Mode",
      highlightLinks: "Highlight Links",
      highlightTitles: "Highlight Headings",
      readingGuide: "Reading Guide",
      keyboardNavigation: "Keyboard Navigation",
      readingMask: "Reading Mask",
      customCursor: "Custom Cursor"
    }
  };
  
  // Barrierefreiheitsprofile
  const accessibilityProfiles = [
    {
      id: 'visionImpaired',
      title: {
        de: 'Sehbeeinträchtigungen',
        en: 'Vision Impaired'
      },
      description: {
        de: 'Größerer Text, höherer Kontrast',
        en: 'Larger text, higher contrast'
      },
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="#0066cc"/></svg>',
      settings: {
        textSize: 2,
        contrastMode: 'increased',
        fontFamily: 'readable',
        lineHeight: 1
      }
    },
    {
      id: 'cognitiveDisability',
      title: {
        de: 'Kognitive Beeinträchtigungen',
        en: 'Cognitive Disability'
      },
      description: {
        de: 'Lesbarkeit, Struktur, einfachere Darstellung',
        en: 'Readability, structure, simplified display'
      },
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M15.5 11C16.3284 11 17 10.3284 17 9.5C17 8.67157 16.3284 8 15.5 8C14.6716 8 14 8.67157 14 9.5C14 10.3284 14.6716 11 15.5 11Z" fill="#0066cc"/><path d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z" fill="#0066cc"/><path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12 17.5C14.33 17.5 16.32 16.05 17.12 14H15.45C14.76 15.19 13.48 16 12 16C10.52 16 9.25 15.19 8.55 14H6.88C7.68 16.05 9.67 17.5 12 17.5Z" fill="#0066cc"/></svg>',
      settings: {
        fontFamily: 'readable',
        lineHeight: 2,
        wordSpacing: 2,
        textAlign: 'left',
        highlightTitles: true
      }
    },
    {
      id: 'senior',
      title: {
        de: 'Senioren',
        en: 'Senior'
      },
      description: {
        de: 'Größerer Text, bessere Lesbarkeit',
        en: 'Larger text, better readability'
      },
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 6.5C12.83 6.5 13.5 5.83 13.5 5C13.5 4.17 12.83 3.5 12 3.5C11.17 3.5 10.5 4.17 10.5 5C10.5 5.83 11.17 6.5 12 6.5ZM12 8.5C11.35 8.5 10.7 8.62 10.1 8.85C11.05 9.5 11.65 10.55 11.75 11.75L12.15 16.05C12.2 16.55 12.6 16.95 13.1 16.95C13.65 16.95 14.1 16.5 14.1 15.95L14 13.55L15 15.5V20.5H17V14.75L14.9 10.05C14.55 9.32 13.85 8.81 13.05 8.6C12.7 8.53 12.35 8.5 12 8.5ZM16.88 3.75L14.38 6.25C13.98 6.65 13.98 7.3 14.38 7.7L16.88 10.2C17.28 10.6 17.93 10.6 18.33 10.2L20.83 7.7C21.23 7.3 21.23 6.65 20.83 6.25L18.33 3.75C17.93 3.35 17.28 3.35 16.88 3.75ZM9 8.5C7.62 8.5 6.5 9.62 6.5 11C6.5 11.96 7.12 12.78 8 13.15V20.5H10V13.15C10.88 12.78 11.5 11.96 11.5 11C11.5 9.62 10.38 8.5 9 8.5Z" fill="#0066cc"/></svg>',
      settings: {
        textSize: 2,
        contrastMode: 'increased',
        fontFamily: 'readable',
        highlightLinks: true,
        lineHeight: 1
      }
    },
    {
      id: 'motorImpaired',
      title: {
        de: 'Motorische Beeinträchtigungen',
        en: 'Motor Impaired'
      },
      description: {
        de: 'Erleichterte Steuerung, größeres Klick-Ziel',
        en: 'Easier navigation, larger click targets'
      },
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M19.75 7.31L18.59 8.47C17.59 7.56 16.34 7 15 7C12.24 7 10 9.24 10 12V13H7.92C7.4 13 6.97 13.4 7.01 13.92L7.7 21.74C7.76 22.43 8.33 22.95 9.02 22.95H11.8C12.53 22.95 13.13 22.35 13.13 21.62C13.13 20.89 12.53 20.29 11.8 20.29H10.39L9.97 16H16.38L19.78 9.44C20.25 8.65 20.15 7.63 19.75 7.31ZM10.54 14.67L10.29 16H14V12C14 11.45 14.45 11 15 11C15.55 11 16 11.45 16 12L13.88 15.29C13.62 15.69 13.05 15.94 12.5 15.94H10.54V14.67ZM17.5 5C16.67 5 16 4.33 16 3.5C16 2.67 16.67 2 17.5 2C18.33 2 19 2.67 19 3.5C19 4.33 18.33 5 17.5 5ZM12.5 1.5C13.33 1.5 14 2.17 14 3C14 3.83 13.33 4.5 12.5 4.5C11.67 4.5 11 3.83 11 3C11 2.17 11.67 1.5 12.5 1.5ZM9 3C9.83 3 10.5 3.67 10.5 4.5C10.5 5.33 9.83 6 9 6C8.17 6 7.5 5.33 7.5 4.5C7.5 3.67 8.17 3 9 3ZM5.5 2C6.33 2 7 2.67 7 3.5C7 4.33 6.33 5 5.5 5C4.67 5 4 4.33 4 3.5C4 2.67 4.67 2 5.5 2Z" fill="#0066cc"/></svg>',
      settings: {
        keyboardNavigation: true,
        highlightFocus: true,
        customCursor: true,
        cursorSize: 'big',
        cursorColor: 'black',
        textSize: 1
      }
    },
    {
      id: 'adhdFriendly',
      title: {
        de: 'ADHS-Modus',
        en: 'ADHD Friendly'
      },
      description: {
        de: 'Reduzierte Ablenkungen, Lesefokus',
        en: 'Reduced distractions, reading focus'
      },
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#0066cc"/></svg>',
      settings: {
        readingMask: true,
        readingGuide: true,
        stopAnimations: true,
        contrastMode: 'increased'
      }
    },
    {
      id: 'dyslexiaFriendly',
      title: {
        de: 'Legasthenie-Modus',
        en: 'Dyslexia Friendly'
      },
      description: {
        de: 'Spezielle Schriftart, Zeilenabstand',
        en: 'Special font, line spacing'
      },
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.9 1.25 21.15 1.5 21.15C1.6 21.15 1.65 21.1 1.75 21.1C3.1 20.45 5.05 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.35 20.65 15.8 20 17.5 20C19.15 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.1C22.75 21.1 23 20.85 23 20.6V6C22.4 5.55 21.75 5.25 21 5ZM21 18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.7 6.5 19.9 6.65 21 7V18.5Z" fill="#0066cc"/><path d="M17.5 10.5C18.38 10.5 19.23 10.59 20 10.76V9.24C19.21 9.09 18.36 9 17.5 9C16.22 9 15.04 9.18 14 9.5V11.07C14.97 10.71 16.18 10.5 17.5 10.5Z" fill="#0066cc"/><path d="M17.5 13.5C18.38 13.5 19.23 13.59 20 13.76V12.24C19.21 12.09 18.36 12 17.5 12C16.22 12 15.04 12.18 14 12.5V14.07C14.97 13.71 16.18 13.5 17.5 13.5Z" fill="#0066cc"/><path d="M17.5 16.5C18.38 16.5 19.23 16.59 20 16.76V15.24C19.21 15.09 18.36 15 17.5 15C16.22 15 15.04 15.18 14 15.5V17.07C14.97 16.71 16.18 16.5 17.5 16.5Z" fill="#0066cc"/></svg>',
      settings: {
        fontFamily: 'dyslexic',
        lineHeight: 2,
        letterSpacing: 1,
        wordSpacing: 1,
        textAlign: 'left',
        textSize: 1
      }
    }
  ];
  
  // Aktuelle Sprache
  let currentLanguage = 'de';
  
  // ===============================================================
  // Widget-Funktionen
  // ===============================================================
  
  /**
   * Widget-Initialisierung
   */
  function init() {
    // Sprache aus Browser oder HTML-Attribut erkennen
    detectLanguage();
    
    // Gespeicherte Einstellungen laden
    loadSavedSettings();
    
    // Widget-DOM erstellen
    createWidgetDOM();
    
    // Event-Listener hinzufügen
    addEventListeners();
    
    // Styles für Einstellungen anwenden, falls vorhanden
    applyAccessibilityStyles();
    
    console.log('Accessibility Widget initialized');
  }
  
  /**
   * Sprache erkennen
   */
  function detectLanguage() {
    // Aus localStorage laden
    const savedLanguage = localStorage.getItem('accessibility-language');
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      currentLanguage = savedLanguage;
      return;
    }
    
    // Aus HTML lang-Attribut erkennen
    const htmlLang = document.documentElement.lang || '';
    if (htmlLang.startsWith('en')) {
      currentLanguage = 'en';
    } else if (htmlLang.startsWith('de')) {
      currentLanguage = 'de';
    } else {
      // Browser-Sprache als Fallback
      const browserLang = navigator.language || navigator.userLanguage || 'de';
      if (browserLang.startsWith('en')) {
        currentLanguage = 'en';
      }
    }
  }
  
  /**
   * Gespeicherte Einstellungen laden
   */
  function loadSavedSettings() {
    try {
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        Object.assign(settings, JSON.parse(savedSettings));
      }
    } catch (e) {
      console.error('Failed to load accessibility settings', e);
    }
  }
  
  /**
   * Widget-DOM erstellen
   */
  function createWidgetDOM() {
    // 1. Container erstellen
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'accessibility-widget-container';
    widgetContainer.setAttribute('data-accessibility-widget', 'true');
    document.body.appendChild(widgetContainer);
    
    // 2. Button erstellen
    createWidgetButton();
    
    // 3. Panel erstellen
    createWidgetPanel();
    
    // 4. Stylesheet erstellen
    createWidgetStyles();
  }
  
  /**
   * Widget-Button erstellen
   */
  function createWidgetButton() {
    widgetButton = document.createElement('button');
    widgetButton.id = 'accessibility-widget-button';
    widgetButton.className = 'accessibility-widget-button';
    widgetButton.setAttribute('aria-label', getTranslation('accessibilityMenu'));
    widgetButton.setAttribute('aria-expanded', 'false');
    
    // SVG-Icon
    widgetButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="36" height="36" fill="#ffffff">
        <circle cx="25" cy="25" r="20" fill="#0066cc"/>
        <path d="M25 15 A 1 1 0 0 1 25.1 35 A 1 1 0 0 1 25 15" fill="#ffffff"/>
        <path d="M17 26 L25 38 L33 26" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `;
    
    // Styles
    Object.assign(widgetButton.style, {
      position: 'fixed',
      bottom: '20px',
      [config.position]: '20px',
      width: `${config.buttonSize}px`,
      height: `${config.buttonSize}px`,
      borderRadius: '50%',
      backgroundColor: '#0066cc',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      border: 'none',
      outline: 'none',
      padding: '0',
      zIndex: config.zIndex,
      transition: 'transform 0.3s ease',
      pointerEvents: 'auto'
    });
    
    widgetContainer.appendChild(widgetButton);
  }
  
  /**
   * Widget-Panel erstellen
   */
  function createWidgetPanel() {
    widgetPanel = document.createElement('div');
    widgetPanel.id = 'accessibility-widget-panel';
    widgetPanel.className = 'accessibility-widget-panel';
    widgetPanel.setAttribute('role', 'dialog');
    widgetPanel.setAttribute('aria-labelledby', 'accessibility-widget-title');
    widgetPanel.setAttribute('aria-hidden', 'true');
    widgetPanel.setAttribute('data-accessibility-widget', 'true');
    
    // Panel Styles
    Object.assign(widgetPanel.style, {
      position: 'fixed',
      top: '20px',
      [config.position]: '20px',
      width: '340px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 5px 25px rgba(0, 0, 0, 0.15)',
      zIndex: config.zIndex - 1,
      opacity: '0',
      visibility: 'hidden',
      transform: 'translateY(-20px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      pointerEvents: 'auto'
    });
    
    // Panel-Inhalt
    widgetPanel.innerHTML = `
      <!-- Header -->
      <div class="accessibility-widget-header">
        <div class="accessibility-widget-title">
          <div class="accessibility-widget-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="24" height="24">
              <circle cx="25" cy="25" r="20" fill="#0066cc"/>
              <path d="M25 15 A 1 1 0 0 1 25.1 35 A 1 1 0 0 1 25 15" fill="#ffffff"/>
              <path d="M17 26 L25 38 L33 26" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
          </div>
          <h2>Accessible</h2>
        </div>
        <div class="accessibility-widget-controls">
          <button id="accessibility-widget-reset" aria-label="${getTranslation('resetSettings')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            <span>${getTranslation('reset')}</span>
          </button>
          <button id="accessibility-widget-close" aria-label="${getTranslation('closeAriaLabel')}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Language Selector -->
      <div class="accessibility-widget-language">
        <select id="accessibility-widget-language-selector">
          <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>🇬🇧 English</option>
          <option value="de" ${currentLanguage === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
        </select>
      </div>
      
      <!-- Tabs -->
      <div class="accessibility-widget-tabs">
        <button class="accessibility-widget-tab active" data-tab="profiles">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>${getTranslation('profiles')}</span>
        </button>
        <button class="accessibility-widget-tab" data-tab="vision">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>${getTranslation('vision')}</span>
        </button>
        <button class="accessibility-widget-tab" data-tab="content">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <path d="M14 2v6h6"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
            <path d="M10 9H8"></path>
          </svg>
          <span>${getTranslation('content')}</span>
        </button>
        <button class="accessibility-widget-tab" data-tab="navigation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          <span>${getTranslation('navigation')}</span>
        </button>
      </div>
      
      <!-- Tab Content -->
      <div class="accessibility-widget-content">
        <!-- Profiles Tab -->
        <div class="accessibility-widget-tab-content active" data-tab-content="profiles">
          <div class="accessibility-widget-section-header">
            <h3>${getTranslation('accessibilityProfiles')}</h3>
            <button class="accessibility-widget-reset-small">${getTranslation('reset')}</button>
          </div>
          
          <div class="accessibility-widget-profiles-grid">
            ${accessibilityProfiles.map(profile => `
              <div class="accessibility-widget-profile-card" data-profile="${profile.id}">
                <div class="accessibility-widget-profile-icon">
                  ${profile.icon}
                </div>
                <div class="accessibility-widget-profile-info">
                  <div class="accessibility-widget-profile-title">${profile.title[currentLanguage]}</div>
                  <div class="accessibility-widget-profile-desc">${profile.description[currentLanguage]}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Vision Tab -->
        <div class="accessibility-widget-tab-content" data-tab-content="vision">
          <div class="accessibility-widget-section-header">
            <h3>${getTranslation('visionSettings')}</h3>
          </div>
          
          <div class="accessibility-widget-controls">
            <div class="accessibility-widget-control-group">
              <label for="accessibility-widget-text-size">${getTranslation('textSize')}</label>
              <div class="accessibility-widget-slider-container">
                <input type="range" id="accessibility-widget-text-size" min="0" max="5" step="1" value="${settings.textSize}">
                <span class="accessibility-widget-value">${settings.textSize}</span>
              </div>
            </div>
            
            <div class="accessibility-widget-control-group">
              <label for="accessibility-widget-contrast">${getTranslation('contrast')}</label>
              <select id="accessibility-widget-contrast">
                <option value="default" ${settings.contrastMode === 'default' ? 'selected' : ''}>${getTranslation('standard')}</option>
                <option value="increased" ${settings.contrastMode === 'increased' ? 'selected' : ''}>Erhöht</option>
                <option value="high" ${settings.contrastMode === 'high' ? 'selected' : ''}>Hoch (Schwarz/Gelb)</option>
                <option value="dark" ${settings.contrastMode === 'dark' ? 'selected' : ''}>Dunkel</option>
                <option value="light" ${settings.contrastMode === 'light' ? 'selected' : ''}>Hell</option>
              </select>
            </div>
            
            <div class="accessibility-widget-control-switch">
              <label for="accessibility-widget-dark-mode">${getTranslation('darkMode')}</label>
              <div class="accessibility-widget-switch">
                <input type="checkbox" id="accessibility-widget-dark-mode" ${settings.darkMode ? 'checked' : ''}>
                <span class="accessibility-widget-switch-slider"></span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Content Tab -->
        <div class="accessibility-widget-tab-content" data-tab-content="content">
          <div class="accessibility-widget-section-header">
            <h3>${getTranslation('contentSettings')}</h3>
          </div>
          
          <div class="accessibility-widget-controls">
            <div class="accessibility-widget-control-group">
              <label for="accessibility-widget-font-family">${getTranslation('fontFamily')}</label>
              <select id="accessibility-widget-font-family">
                <option value="default" ${settings.fontFamily === 'default' ? 'selected' : ''}>${getTranslation('standard')}</option>
                <option value="readable" ${settings.fontFamily === 'readable' ? 'selected' : ''}>Leicht lesbar</option>
                <option value="dyslexic" ${settings.fontFamily === 'dyslexic' ? 'selected' : ''}>Legasthenie-freundlich</option>
              </select>
            </div>
            
            <div class="accessibility-widget-control-group">
              <label for="accessibility-widget-line-height">${getTranslation('lineHeight')}</label>
              <div class="accessibility-widget-slider-container">
                <input type="range" id="accessibility-widget-line-height" min="0" max="5" step="1" value="${settings.lineHeight}">
                <span class="accessibility-widget-value">${settings.lineHeight}</span>
              </div>
            </div>
            
            <div class="accessibility-widget-control-switch">
              <label for="accessibility-widget-highlight-links">${getTranslation('highlightLinks')}</label>
              <div class="accessibility-widget-switch">
                <input type="checkbox" id="accessibility-widget-highlight-links" ${settings.highlightLinks ? 'checked' : ''}>
                <span class="accessibility-widget-switch-slider"></span>
              </div>
            </div>
            
            <div class="accessibility-widget-control-switch">
              <label for="accessibility-widget-highlight-titles">${getTranslation('highlightTitles')}</label>
              <div class="accessibility-widget-switch">
                <input type="checkbox" id="accessibility-widget-highlight-titles" ${settings.highlightTitles ? 'checked' : ''}>
                <span class="accessibility-widget-switch-slider"></span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation Tab -->
        <div class="accessibility-widget-tab-content" data-tab-content="navigation">
          <div class="accessibility-widget-section-header">
            <h3>${getTranslation('navigationSettings')}</h3>
          </div>
          
          <div class="accessibility-widget-controls">
            <div class="accessibility-widget-control-switch">
              <label for="accessibility-widget-keyboard-navigation">${getTranslation('keyboardNavigation')}</label>
              <div class="accessibility-widget-switch">
                <input type="checkbox" id="accessibility-widget-keyboard-navigation" ${settings.keyboardNavigation ? 'checked' : ''}>
                <span class="accessibility-widget-switch-slider"></span>
              </div>
            </div>
            
            <div class="accessibility-widget-control-switch">
              <label for="accessibility-widget-reading-mask">${getTranslation('readingMask')}</label>
              <div class="accessibility-widget-switch">
                <input type="checkbox" id="accessibility-widget-reading-mask" ${settings.readingMask ? 'checked' : ''}>
                <span class="accessibility-widget-switch-slider"></span>
              </div>
            </div>
            
            <div class="accessibility-widget-control-switch">
              <label for="accessibility-widget-reading-guide">${getTranslation('readingGuide')}</label>
              <div class="accessibility-widget-switch">
                <input type="checkbox" id="accessibility-widget-reading-guide" ${settings.readingGuide ? 'checked' : ''}>
                <span class="accessibility-widget-switch-slider"></span>
              </div>
            </div>
            
            <div class="accessibility-widget-control-switch">
              <label for="accessibility-widget-custom-cursor">${getTranslation('customCursor')}</label>
              <div class="accessibility-widget-switch">
                <input type="checkbox" id="accessibility-widget-custom-cursor" ${settings.customCursor ? 'checked' : ''}>
                <span class="accessibility-widget-switch-slider"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="accessibility-widget-footer">
        <button id="accessibility-widget-reset-all">${getTranslation('resetAllSettings')}</button>
      </div>
    `;
    
    widgetContainer.appendChild(widgetPanel);
  }
  
  /**
   * Widget-Styles erstellen
   */
  function createWidgetStyles() {
    styleElement = document.createElement('style');
    styleElement.id = 'accessibility-widget-styles';
    styleElement.textContent = `
      .accessibility-widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
        background-color: #f8f9fa;
      }
      
      .accessibility-widget-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .accessibility-widget-title h2 {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
        color: #333;
      }
      
      .accessibility-widget-controls {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .accessibility-widget-controls button {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        color: #666;
        padding: 5px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }
      
      .accessibility-widget-controls button:hover {
        background-color: #f0f0f0;
      }
      
      .accessibility-widget-language {
        padding: 10px;
        text-align: right;
        border-bottom: 1px solid #eee;
      }
      
      .accessibility-widget-language select {
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        background-color: white;
      }
      
      .accessibility-widget-tabs {
        display: flex;
        border-bottom: 1px solid #eee;
        background-color: #f8f9fa;
      }
      
      .accessibility-widget-tab {
        flex: 1;
        padding: 10px 5px;
        border: none;
        background: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #666;
        transition: color 0.2s, border-bottom 0.2s;
        border-bottom: 2px solid transparent;
      }
      
      .accessibility-widget-tab.active {
        color: #0066cc;
        border-bottom: 2px solid #0066cc;
      }
      
      .accessibility-widget-tab svg {
        margin-bottom: 4px;
      }
      
      .accessibility-widget-tab span {
        font-size: 12px;
      }
      
      .accessibility-widget-content {
        flex: 1;
        overflow-y: auto;
        padding: 0;
      }
      
      .accessibility-widget-tab-content {
        display: none;
        padding: 15px;
      }
      
      .accessibility-widget-tab-content.active {
        display: block;
      }
      
      .accessibility-widget-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .accessibility-widget-section-header h3 {
        font-size: 14px;
        font-weight: 600;
        margin: 0;
        color: #333;
        text-transform: uppercase;
      }
      
      .accessibility-widget-reset-small {
        background: none;
        border: none;
        color: #666;
        font-size: 12px;
        cursor: pointer;
        padding: 0;
        text-decoration: underline;
      }
      
      .accessibility-widget-profiles-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-bottom: 10px;
      }
      
      .accessibility-widget-profile-card {
        padding: 15px;
        border: 1px solid #eee;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .accessibility-widget-profile-card:hover {
        border-color: #0066cc;
        box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15);
        transform: translateY(-2px);
      }
      
      .accessibility-widget-profile-card.active {
        border-color: #0066cc;
        background-color: rgba(0, 102, 204, 0.05);
      }
      
      .accessibility-widget-profile-icon {
        margin-bottom: 10px;
      }
      
      .accessibility-widget-profile-title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 5px;
        color: #333;
      }
      
      .accessibility-widget-profile-desc {
        font-size: 12px;
        color: #666;
      }
      
      .accessibility-widget-controls {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      .accessibility-widget-control-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      
      .accessibility-widget-control-group label {
        font-weight: 600;
        font-size: 14px;
        color: #333;
      }
      
      .accessibility-widget-slider-container {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .accessibility-widget-slider-container input[type="range"] {
        flex: 1;
        width: 100%;
        height: 6px;
        -webkit-appearance: none;
        appearance: none;
        background: #ddd;
        border-radius: 3px;
        outline: none;
      }
      
      .accessibility-widget-slider-container input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #0066cc;
        cursor: pointer;
      }
      
      .accessibility-widget-slider-container input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #0066cc;
        cursor: pointer;
        border: none;
      }
      
      .accessibility-widget-value {
        width: 20px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
      
      .accessibility-widget-control-group select {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: white;
        font-size: 14px;
        color: #333;
        width: 100%;
      }
      
      .accessibility-widget-control-switch {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .accessibility-widget-control-switch label {
        font-weight: 600;
        font-size: 14px;
        color: #333;
      }
      
      .accessibility-widget-switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 22px;
      }
      
      .accessibility-widget-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .accessibility-widget-switch-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 22px;
      }
      
      .accessibility-widget-switch-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      
      .accessibility-widget-switch input:checked + .accessibility-widget-switch-slider {
        background-color: #0066cc;
      }
      
      .accessibility-widget-switch input:checked + .accessibility-widget-switch-slider:before {
        transform: translateX(22px);
      }
      
      .accessibility-widget-footer {
        padding: 15px;
        border-top: 1px solid #eee;
        text-align: center;
        background-color: #f8f9fa;
      }
      
      #accessibility-widget-reset-all {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        padding: 8px 15px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      #accessibility-widget-reset-all:hover {
        background-color: #f1b0b7;
      }
      
      /* Reading mask */
      #accessibility-reading-mask-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999997;
        pointer-events: none;
      }
      
      #accessibility-reading-guide {
        position: fixed;
        width: 100%;
        height: 30px;
        background-color: rgba(255, 255, 0, 0.2);
        border-top: 1px solid rgba(255, 200, 0, 0.5);
        border-bottom: 1px solid rgba(255, 200, 0, 0.5);
        z-index: 999997;
        pointer-events: none;
        transition: top 0.1s ease;
      }
      
      #accessibility-custom-cursor {
        position: fixed;
        border-radius: 50%;
        z-index: 999999;
        pointer-events: none;
        transform: translate(-50%, -50%);
      }
    `;
    
    document.head.appendChild(styleElement);
  }
  
  /**
   * Event-Listener hinzufügen
   */
  function addEventListeners() {
    // Widget öffnen/schließen
    widgetButton.addEventListener('click', toggleWidget);
    
    // Schließen-Button
    const closeButton = document.getElementById('accessibility-widget-close');
    if (closeButton) {
      closeButton.addEventListener('click', toggleWidget);
    }
    
    // Reset-Buttons
    const resetButton = document.getElementById('accessibility-widget-reset');
    if (resetButton) {
      resetButton.addEventListener('click', resetSettings);
    }
    
    const resetAllButton = document.getElementById('accessibility-widget-reset-all');
    if (resetAllButton) {
      resetAllButton.addEventListener('click', resetSettings);
    }
    
    const smallResetButtons = document.querySelectorAll('.accessibility-widget-reset-small');
    smallResetButtons.forEach(button => {
      button.addEventListener('click', resetSettings);
    });
    
    // Tab-Wechsel
    const tabButtons = document.querySelectorAll('.accessibility-widget-tab');
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        if (tabId) {
          switchTab(tabId);
        }
      });
    });
    
    // Sprache ändern
    const languageSelector = document.getElementById('accessibility-widget-language-selector');
    if (languageSelector) {
      languageSelector.addEventListener('change', function() {
        setLanguage(this.value);
      });
    }
    
    // Profile anwenden
    const profileCards = document.querySelectorAll('.accessibility-widget-profile-card');
    profileCards.forEach(card => {
      card.addEventListener('click', function() {
        const profileId = this.getAttribute('data-profile');
        if (profileId) {
          applyProfile(profileId);
        }
      });
    });
    
    // Einstellungen ändern - Slider
    const textSizeSlider = document.getElementById('accessibility-widget-text-size');
    if (textSizeSlider) {
      textSizeSlider.addEventListener('input', function() {
        const value = parseInt(this.value, 10);
        updateSetting('textSize', value);
        document.querySelector('#accessibility-widget-text-size + .accessibility-widget-value').textContent = value;
      });
    }
    
    const lineHeightSlider = document.getElementById('accessibility-widget-line-height');
    if (lineHeightSlider) {
      lineHeightSlider.addEventListener('input', function() {
        const value = parseInt(this.value, 10);
        updateSetting('lineHeight', value);
        document.querySelector('#accessibility-widget-line-height + .accessibility-widget-value').textContent = value;
      });
    }
    
    // Einstellungen ändern - Selects
    const contrastSelect = document.getElementById('accessibility-widget-contrast');
    if (contrastSelect) {
      contrastSelect.addEventListener('change', function() {
        updateSetting('contrastMode', this.value);
      });
    }
    
    const fontFamilySelect = document.getElementById('accessibility-widget-font-family');
    if (fontFamilySelect) {
      fontFamilySelect.addEventListener('change', function() {
        updateSetting('fontFamily', this.value);
      });
    }
    
    // Einstellungen ändern - Switches
    const switchInputs = document.querySelectorAll('.accessibility-widget-switch input');
    switchInputs.forEach(input => {
      input.addEventListener('change', function() {
        const settingId = this.id.replace('accessibility-widget-', '').replace(/-/g, '');
        updateSetting(settingId, this.checked);
      });
    });
    
    // Klick außerhalb schließt Widget
    document.addEventListener('click', function(event) {
      if (isOpen && 
          !widgetContainer.contains(event.target) && 
          event.target !== widgetButton) {
        toggleWidget();
      }
    });
    
    // Verhindern, dass Klicks im Widget zum Schließen führen
    widgetPanel.addEventListener('click', function(event) {
      event.stopPropagation();
    });
    
    // Lesemasken-Mausbewegung
    document.addEventListener('mousemove', function(event) {
      if (settings.readingMask) {
        updateReadingMask(event);
      }
      if (settings.readingGuide) {
        updateReadingGuide(event);
      }
      if (settings.customCursor) {
        updateCustomCursor(event);
      }
    });
    
    // Escape-Taste schließt Widget
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && isOpen) {
        toggleWidget();
      }
    });
  }
  
  // ===============================================================
  // Widget Steuerung
  // ===============================================================
  
  /**
   * Widget öffnen/schließen
   */
  function toggleWidget() {
    isOpen = !isOpen;
    
    if (isOpen) {
      // Widget öffnen
      widgetPanel.style.opacity = '1';
      widgetPanel.style.visibility = 'visible';
      widgetPanel.style.transform = 'translateY(0)';
      widgetPanel.setAttribute('aria-hidden', 'false');
      widgetButton.setAttribute('aria-expanded', 'true');
    } else {
      // Widget schließen
      widgetPanel.style.opacity = '0';
      widgetPanel.style.visibility = 'hidden';
      widgetPanel.style.transform = 'translateY(-20px)';
      widgetPanel.setAttribute('aria-hidden', 'true');
      widgetButton.setAttribute('aria-expanded', 'false');
    }
  }
  
  /**
   * Tab wechseln
   */
  function switchTab(tabId) {
    if (!tabId || tabId === activeTab) return;
    
    activeTab = tabId;
    
    // Tab-Buttons aktualisieren
    const tabButtons = document.querySelectorAll('.accessibility-widget-tab');
    tabButtons.forEach(button => {
      if (button.getAttribute('data-tab') === tabId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Tab-Inhalte aktualisieren
    const tabContents = document.querySelectorAll('.accessibility-widget-tab-content');
    tabContents.forEach(content => {
      if (content.getAttribute('data-tab-content') === tabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }
  
  /**
   * Profil anwenden
   */
  function applyProfile(profileId) {
    const profile = accessibilityProfiles.find(p => p.id === profileId);
    
    if (profile) {
      // Aktives Profil setzen oder zurücksetzen
      if (activeProfile === profileId) {
        activeProfile = null;
        
        // Alle Profil-Karten deaktivieren
        const profileCards = document.querySelectorAll('.accessibility-widget-profile-card');
        profileCards.forEach(card => {
          card.classList.remove('active');
        });
        
        // Einstellungen zurücksetzen
        resetSettings();
        
        return;
      }
      
      activeProfile = profileId;
      
      // Alle Profil-Karten aktualisieren
      const profileCards = document.querySelectorAll('.accessibility-widget-profile-card');
      profileCards.forEach(card => {
        if (card.getAttribute('data-profile') === profileId) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
      
      // Profil-Einstellungen anwenden
      Object.entries(profile.settings).forEach(([key, value]) => {
        updateSetting(key, value);
      });
    }
  }
  
  /**
   * Einstellung aktualisieren
   */
  function updateSetting(key, value) {
    if (key in settings) {
      // Einstellung ändern
      settings[key] = value;
      
      // UI-Element aktualisieren
      updateSettingUI(key, value);
      
      // Einstellungen anwenden
      applyAccessibilityStyles();
      
      // Einstellungen speichern
      saveSettings();
    }
  }
  
  /**
   * UI-Element für eine Einstellung aktualisieren
   */
  function updateSettingUI(key, value) {
    switch (key) {
      case 'textSize':
        const textSizeSlider = document.getElementById('accessibility-widget-text-size');
        const textSizeValue = document.querySelector('#accessibility-widget-text-size + .accessibility-widget-value');
        if (textSizeSlider) textSizeSlider.value = value;
        if (textSizeValue) textSizeValue.textContent = value;
        break;
        
      case 'lineHeight':
        const lineHeightSlider = document.getElementById('accessibility-widget-line-height');
        const lineHeightValue = document.querySelector('#accessibility-widget-line-height + .accessibility-widget-value');
        if (lineHeightSlider) lineHeightSlider.value = value;
        if (lineHeightValue) lineHeightValue.textContent = value;
        break;
        
      case 'contrastMode':
        const contrastSelect = document.getElementById('accessibility-widget-contrast');
        if (contrastSelect) contrastSelect.value = value;
        break;
        
      case 'fontFamily':
        const fontFamilySelect = document.getElementById('accessibility-widget-font-family');
        if (fontFamilySelect) fontFamilySelect.value = value;
        break;
        
      default:
        // Für boolesche Werte (Switches)
        if (typeof value === 'boolean') {
          const settingId = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          const switchInput = document.getElementById(`accessibility-widget-${settingId}`);
          if (switchInput) switchInput.checked = value;
        }
    }
  }
  
  /**
   * Alle Einstellungen zurücksetzen
   */
  function resetSettings() {
    // Einstellungen zurücksetzen
    Object.assign(settings, defaultSettings);
    
    // Aktives Profil zurücksetzen
    activeProfile = null;
    
    // UI aktualisieren
    const sliders = document.querySelectorAll('.accessibility-widget-slider-container input[type="range"]');
    sliders.forEach(slider => {
      const value = defaultSettings[slider.id.replace('accessibility-widget-', '').replace(/-/g, '')];
      slider.value = value;
      const valueSpan = slider.nextElementSibling;
      if (valueSpan) valueSpan.textContent = value;
    });
    
    const selects = document.querySelectorAll('.accessibility-widget-control-group select');
    selects.forEach(select => {
      const key = select.id.replace('accessibility-widget-', '').replace(/-/g, '');
      select.value = defaultSettings[key] || 'default';
    });
    
    const switches = document.querySelectorAll('.accessibility-widget-switch input');
    switches.forEach(input => {
      const key = input.id.replace('accessibility-widget-', '').replace(/-/g, '');
      input.checked = defaultSettings[key] || false;
    });
    
    // Profile-Karten zurücksetzen
    const profileCards = document.querySelectorAll('.accessibility-widget-profile-card');
    profileCards.forEach(card => {
      card.classList.remove('active');
    });
    
    // Einstellungen anwenden
    applyAccessibilityStyles();
    
    // Einstellungen speichern
    saveSettings();
  }
  
  /**
   * Sprache ändern
   */
  function setLanguage(language) {
    if (language === 'de' || language === 'en') {
      currentLanguage = language;
      
      // Sprache speichern
      localStorage.setItem('accessibility-language', language);
      
      // Widget neu erstellen
      widgetPanel.remove();
      createWidgetPanel();
      addEventListeners();
    }
  }
  
  /**
   * Übersetzung abrufen
   */
  function getTranslation(key) {
    return translations[currentLanguage]?.[key] || translations.de[key] || key;
  }
  
  /**
   * Einstellungen speichern
   */
  function saveSettings() {
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save accessibility settings', e);
    }
  }
  
  // ===============================================================
  // Barrierefreiheits-Funktionen
  // ===============================================================
  
  /**
   * Alle Barrierefreiheits-Einstellungen anwenden
   */
  function applyAccessibilityStyles() {
    // Altes Stylesheet entfernen
    const oldStylesheet = document.getElementById('accessibility-settings-styles');
    if (oldStylesheet) {
      oldStylesheet.remove();
    }
    
    // CSS-Regeln erstellen
    let cssRules = '';
    
    // Kontrastmodus
    if (settings.contrastMode !== 'default') {
      cssRules += getContrastModeStyles(settings.contrastMode);
    }
    
    // Textgröße
    if (settings.textSize > 0) {
      cssRules += getTextSizeStyles(settings.textSize);
    }
    
    // Schriftart
    if (settings.fontFamily !== 'default') {
      cssRules += getFontFamilyStyles(settings.fontFamily);
    }
    
    // Zeilenabstand
    if (settings.lineHeight > 0) {
      cssRules += getLineHeightStyles(settings.lineHeight);
    }
    
    // Buchstabenabstand
    if (settings.letterSpacing > 0) {
      cssRules += getLetterSpacingStyles(settings.letterSpacing);
    }
    
    // Wortabstand
    if (settings.wordSpacing > 0) {
      cssRules += getWordSpacingStyles(settings.wordSpacing);
    }
    
    // Textausrichtung
    if (settings.textAlign !== 'default') {
      cssRules += getTextAlignStyles(settings.textAlign);
    }
    
    // Dunkler Modus
    if (settings.darkMode) {
      cssRules += getDarkModeStyles();
    }
    
    // Links hervorheben
    if (settings.highlightLinks) {
      cssRules += getHighlightLinksStyles();
    }
    
    // Überschriften hervorheben
    if (settings.highlightTitles) {
      cssRules += getHighlightTitlesStyles();
    }
    
    // Tastaturnavigation verbessern
    if (settings.keyboardNavigation) {
      cssRules += getKeyboardNavigationStyles();
    }
    
    // Stylesheet erstellen und einfügen
    if (cssRules) {
      const stylesheet = document.createElement('style');
      stylesheet.id = 'accessibility-settings-styles';
      stylesheet.textContent = cssRules;
      document.head.appendChild(stylesheet);
    }
    
    // Lesemaske
    if (settings.readingMask) {
      createReadingMask();
    } else {
      removeReadingMask();
    }
    
    // Lesehilfe
    if (settings.readingGuide) {
      createReadingGuide();
    } else {
      removeReadingGuide();
    }
    
    // Benutzerdefinierten Cursor
    if (settings.customCursor) {
      createCustomCursor(settings.cursorSize, settings.cursorColor);
    } else {
      removeCustomCursor();
    }
  }
  
  /**
   * Kontrastmodus-Styles generieren
   */
  function getContrastModeStyles(contrastMode) {
    switch (contrastMode) {
      case 'increased':
        return `
          html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          
          html body a:not([data-accessibility-widget="true"] *) {
            color: #0000cc !important;
            text-decoration: underline !important;
          }
        `;
        
      case 'high':
        return `
          html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
            background-color: #000000 !important;
            color: #ffff00 !important;
          }
          
          html body a:not([data-accessibility-widget="true"] *) {
            color: #00ffff !important;
            text-decoration: underline !important;
          }
        `;
        
      case 'dark':
        return `
          html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
            background-color: #1a1a1a !important;
            color: #f0f0f0 !important;
          }
          
          html body a:not([data-accessibility-widget="true"] *) {
            color: #66b3ff !important;
          }
        `;
        
      case 'light':
        return `
          html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          
          html body a:not([data-accessibility-widget="true"] *) {
            color: #0000cc !important;
          }
        `;
        
      default:
        return '';
    }
  }
  
  /**
   * Textgröße-Styles generieren
   */
  function getTextSizeStyles(textSize) {
    const sizeFactor = 1 + (textSize * 0.2);
    return `
      html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
        font-size: ${sizeFactor}em !important;
      }
    `;
  }
  
  /**
   * Schriftart-Styles generieren
   */
  function getFontFamilyStyles(fontFamily) {
    switch (fontFamily) {
      case 'readable':
        return `
          html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
            font-family: Arial, Helvetica, sans-serif !important;
          }
        `;
        
      case 'dyslexic':
        // OpenDyslexic-Schriftart laden
        if (!document.getElementById('accessibility-dyslexic-font')) {
          const fontLink = document.createElement('link');
          fontLink.id = 'accessibility-dyslexic-font';
          fontLink.rel = 'stylesheet';
          fontLink.href = 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic.css';
          document.head.appendChild(fontLink);
        }
        
        return `
          html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
            font-family: 'OpenDyslexic', Arial, sans-serif !important;
          }
        `;
        
      default:
        return '';
    }
  }
  
  /**
   * Zeilenabstand-Styles generieren
   */
  function getLineHeightStyles(lineHeight) {
    const factor = 1.5 + (lineHeight * 0.3);
    return `
      html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
        line-height: ${factor} !important;
      }
    `;
  }
  
  /**
   * Buchstabenabstand-Styles generieren
   */
  function getLetterSpacingStyles(letterSpacing) {
    const spacing = letterSpacing * 0.05;
    return `
      html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
        letter-spacing: ${spacing}em !important;
      }
    `;
  }
  
  /**
   * Wortabstand-Styles generieren
   */
  function getWordSpacingStyles(wordSpacing) {
    const spacing = wordSpacing * 0.2;
    return `
      html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
        word-spacing: ${spacing}em !important;
      }
    `;
  }
  
  /**
   * Textausrichtung-Styles generieren
   */
  function getTextAlignStyles(textAlign) {
    return `
      html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
        text-align: ${textAlign} !important;
      }
    `;
  }
  
  /**
   * Dunkler-Modus-Styles generieren
   */
  function getDarkModeStyles() {
    return `
      html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
        background-color: #1a1a1a !important;
        color: #f0f0f0 !important;
      }
      
      html body a:not([data-accessibility-widget="true"] *) {
        color: #66b3ff !important;
      }
    `;
  }
  
  /**
   * Links-Hervorheben-Styles generieren
   */
  function getHighlightLinksStyles() {
    return `
      html body a:not([data-accessibility-widget="true"] *) {
        text-decoration: underline !important;
        font-weight: bold !important;
        background-color: rgba(0, 0, 238, 0.05) !important;
        border-bottom: 1px solid currentColor !important;
      }
      
      html body a:not([data-accessibility-widget="true"] *):hover,
      html body a:not([data-accessibility-widget="true"] *):focus {
        background-color: rgba(0, 0, 238, 0.1) !important;
        outline: 2px solid !important;
      }
    `;
  }
  
  /**
   * Überschriften-Hervorheben-Styles generieren
   */
  function getHighlightTitlesStyles() {
    return `
      html body h1:not([data-accessibility-widget="true"] *),
      html body h2:not([data-accessibility-widget="true"] *),
      html body h3:not([data-accessibility-widget="true"] *),
      html body h4:not([data-accessibility-widget="true"] *),
      html body h5:not([data-accessibility-widget="true"] *),
      html body h6:not([data-accessibility-widget="true"] *) {
        background-color: rgba(0, 102, 204, 0.05) !important;
        border-left: 5px solid #0066cc !important;
        padding: 5px 8px !important;
        margin: 16px 0 !important;
      }
    `;
  }
  
  /**
   * Tastaturnavigation-Styles generieren
   */
  function getKeyboardNavigationStyles() {
    return `
      html body a:focus:not([data-accessibility-widget="true"] *),
      html body button:focus:not([data-accessibility-widget="true"] *),
      html body input:focus:not([data-accessibility-widget="true"] *),
      html body select:focus:not([data-accessibility-widget="true"] *),
      html body textarea:focus:not([data-accessibility-widget="true"] *),
      html body [tabindex]:focus:not([data-accessibility-widget="true"] *) {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
      }
    `;
  }
  
  /**
   * Lesemaske erstellen
   */
  function createReadingMask() {
    removeReadingMask();
    
    const maskContainer = document.createElement('div');
    maskContainer.id = 'accessibility-reading-mask-container';
    maskContainer.setAttribute('data-accessibility-widget', 'true');
    
    const topMask = document.createElement('div');
    topMask.id = 'accessibility-reading-mask-top';
    topMask.style.position = 'absolute';
    topMask.style.top = '0';
    topMask.style.left = '0';
    topMask.style.width = '100%';
    topMask.style.height = '50%';
    topMask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    topMask.style.transition = 'height 0.2s ease';
    
    const bottomMask = document.createElement('div');
    bottomMask.id = 'accessibility-reading-mask-bottom';
    bottomMask.style.position = 'absolute';
    bottomMask.style.bottom = '0';
    bottomMask.style.left = '0';
    bottomMask.style.width = '100%';
    bottomMask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    bottomMask.style.transition = 'height 0.2s ease';
    
    maskContainer.appendChild(topMask);
    maskContainer.appendChild(bottomMask);
    document.body.appendChild(maskContainer);
    
    // Initiale Position
    updateReadingMask({ clientY: window.innerHeight / 2 });
  }
  
  /**
   * Lesemaske entfernen
   */
  function removeReadingMask() {
    const maskContainer = document.getElementById('accessibility-reading-mask-container');
    if (maskContainer) {
      maskContainer.remove();
    }
  }
  
  /**
   * Lesemaske aktualisieren
   */
  function updateReadingMask(e) {
    const maskContainer = document.getElementById('accessibility-reading-mask-container');
    if (!maskContainer) return;
    
    const topMask = document.getElementById('accessibility-reading-mask-top');
    const bottomMask = document.getElementById('accessibility-reading-mask-bottom');
    
    const lineHeight = 40; // Höhe des sichtbaren Bereichs
    const mouseY = e.clientY;
    const windowHeight = window.innerHeight;
    
    const topHeight = Math.max(0, mouseY - lineHeight / 2);
    const bottomHeight = Math.max(0, windowHeight - mouseY - lineHeight / 2);
    
    topMask.style.height = topHeight + 'px';
    bottomMask.style.height = bottomHeight + 'px';
  }
  
  /**
   * Lesehilfe erstellen
   */
  function createReadingGuide() {
    removeReadingGuide();
    
    const guide = document.createElement('div');
    guide.id = 'accessibility-reading-guide';
    guide.setAttribute('data-accessibility-widget', 'true');
    document.body.appendChild(guide);
    
    // Initiale Position
    updateReadingGuide({ clientY: window.innerHeight / 2 });
  }
  
  /**
   * Lesehilfe entfernen
   */
  function removeReadingGuide() {
    const guide = document.getElementById('accessibility-reading-guide');
    if (guide) {
      guide.remove();
    }
  }
  
  /**
   * Lesehilfe aktualisieren
   */
  function updateReadingGuide(e) {
    const guide = document.getElementById('accessibility-reading-guide');
    if (!guide) return;
    
    const mouseY = e.clientY;
    const guideHeight = 30;
    
    guide.style.top = (mouseY - guideHeight / 2) + 'px';
  }
  
  /**
   * Benutzerdefinierten Cursor erstellen
   */
  function createCustomCursor(size = 'default', color = 'white') {
    removeCustomCursor();
    
    let cursorSize = 16;
    if (size === 'big') cursorSize = 24;
    if (size === 'bigger') cursorSize = 32;
    if (size === 'biggest') cursorSize = 48;
    
    let cursorColor = '#ffffff';
    if (color === 'black') cursorColor = '#000000';
    if (color === 'blue') cursorColor = '#0066cc';
    if (color === 'red') cursorColor = '#cc0000';
    
    const cursor = document.createElement('div');
    cursor.id = 'accessibility-custom-cursor';
    cursor.setAttribute('data-accessibility-widget', 'true');
    cursor.style.width = cursorSize + 'px';
    cursor.style.height = cursorSize + 'px';
    cursor.style.border = `2px solid ${cursorColor}`;
    cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    cursor.style.boxShadow = `0 0 10px ${cursorColor}`;
    
    document.body.appendChild(cursor);
    
    // CSS für normalen Cursor ausblenden
    const cursorStyle = document.createElement('style');
    cursorStyle.id = 'accessibility-cursor-style';
    cursorStyle.textContent = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(cursorStyle);
    
    // Initiale Position
    updateCustomCursor({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
  }
  
  /**
   * Benutzerdefinierten Cursor entfernen
   */
  function removeCustomCursor() {
    const cursor = document.getElementById('accessibility-custom-cursor');
    if (cursor) {
      cursor.remove();
    }
    
    const cursorStyle = document.getElementById('accessibility-cursor-style');
    if (cursorStyle) {
      cursorStyle.remove();
    }
  }
  
  /**
   * Benutzerdefinierten Cursor aktualisieren
   */
  function updateCustomCursor(e) {
    const cursor = document.getElementById('accessibility-custom-cursor');
    if (!cursor) return;
    
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.display = 'block';
  }
  
  // Widget initialisieren (automatisch beim Laden)
  // Prüfen, ob DOMContentLoaded bereits ausgelöst wurde
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOMContentLoaded wurde bereits ausgelöst
    init();
  }
  
  // Öffentliche API
  window.AccessibilityWidget = {
    toggleWidget: toggleWidget,
    resetSettings: resetSettings,
    applyProfile: applyProfile,
    setLanguage: setLanguage
  };
  
})();
