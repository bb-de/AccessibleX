/**
 * Barrierefreiheit-Widget Hauptskript
 * Isolierte und sichere Widget-Implementierung
 * Version 1.0.0
 */
(function(window, document) {
  'use strict';

  // Globales Widget-Objekt erweitern
  window.A11yWidget = window.A11yWidget || {};
  
  // Konfiguration und Statusvariablen
  const widgetState = {
    config: {
      apiBase: '',
      token: '',
      position: 'right',
      language: 'de',
      theme: 'default',
      prefix: 'a11y-widget-' // Standardpräfix, wird vom Loader überschrieben
    },
    isOpen: false,
    container: null,
    button: null,
    panel: null,
    activeTab: 'profiles',
    currentSettings: {},
    translations: {},
    profiles: [
      {
        id: 'visionImpaired',
        icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="#0066cc"/></svg>',
        settings: {
          textSize: 1,
          contrastMode: 'increased',
          fontFamily: 'readable',
          textAlign: 'left'
        }
      },
      // ... andere Profile bleiben unverändert
    ],
    defaultSettings: {
      // Vision settings
      contrastMode: 'default',
      saturation: 100,
      monochrome: 0,
      textColor: 'default',
      titleColor: 'default',
      backgroundColor: 'default',
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
    }
  };
  
  // Mehrsprachigkeit
  const translations = {
    de: {
      profiles: "Profile",
      vision: "Sehen",
      content: "Inhalt",
      navigation: "Navigation",
      // Weitere Übersetzungen...
    },
    en: {
      profiles: "Profiles",
      vision: "Vision",
      content: "Content",
      navigation: "Navigation",
      // Weitere Übersetzungen...
    }
    // Weitere Sprachen...
  };
  
  /**
   * Widget initialisieren
   * @param {Object} options - Konfigurationsoptionen
   */
  function init(options) {
    try {
      // Konfiguration mit Optionen erweitern
      widgetState.config = Object.assign({}, widgetState.config, options);
      
      // Aktuelle Sprache setzen
      widgetState.translations = translations[widgetState.config.language] || translations.de;
      
      // Einstellungen initialisieren
      widgetState.currentSettings = Object.assign({}, widgetState.defaultSettings);
      
      // Widget-Elemente erstellen
      createWidgetElements();
      
      // Event-Listener registrieren
      bindEvents();
      
      // Analytics-Event senden
      sendAnalytics('widget_loaded', {
        language: widgetState.config.language,
        position: widgetState.config.position
      });
      
      console.log('A11yWidget: Widget initialized successfully');
    } catch (error) {
      console.warn('A11yWidget: Error during initialization', error);
    }
  }
  
  /**
   * Widget-Elemente erstellen
   */
  function createWidgetElements() {
    try {
      // Referenz zum Container bekommen
      widgetState.container = document.getElementById(widgetState.config.prefix + 'container');
      
      if (!widgetState.container) {
        throw new Error('Widget container not found');
      }
      
      // Shadow DOM oder direktes Element verwenden
      const target = window.A11yWidget.useShadowDOM ? window.A11yWidget.shadowRoot : widgetState.container;
      
      // Button erstellen
      createWidgetButton(target);
      
      // Panel erstellen
      createWidgetPanel(target);
    } catch (error) {
      console.warn('A11yWidget: Error creating widget elements', error);
    }
  }
  
  /**
   * Widget-Button erstellen
   * @param {ShadowRoot|HTMLElement} target - Container für den Button
   */
  function createWidgetButton(target) {
    const button = document.createElement('button');
    const prefix = widgetState.config.prefix;
    
    button.id = prefix + 'button';
    button.setAttribute('aria-label', widgetState.translations.accessibilityMenu || 'Barrierefreiheit-Einstellungen');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', prefix + 'panel');
    
    // Styles für den Button als Inline-Styles, um CSS-Konflikte zu vermeiden
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '20px',
      [widgetState.config.position]: '20px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#0066cc',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      zIndex: '999999',
      padding: '0',
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
      transition: 'transform 0.3s ease',
      pointerEvents: 'auto'
    });
    
    // Logo als SVG einfügen (direkt im Button)
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="100%" height="100%" fill="#ffffff">
        <circle cx="25" cy="25" r="25" fill="#0066cc"/>
        <path d="M25 12 A 1 1 0 0 1 25 22 A 1 1 0 0 1 25 12" fill="#ffffff"/>
        <path d="M25 26 L25 38" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <path d="M16 32 L34 32" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <path d="M17 26 L25 38 L33 26" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `;
    
    // Hover-Effekt
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
    
    // Button speichern und zum Container hinzufügen
    widgetState.button = button;
    target.appendChild(button);
  }
  
  /**
   * Widget-Panel erstellen
   * @param {ShadowRoot|HTMLElement} target - Container für das Panel
   */
  function createWidgetPanel(target) {
    const panel = document.createElement('div');
    const prefix = widgetState.config.prefix;
    
    panel.id = prefix + 'panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', prefix + 'panel-title');
    panel.setAttribute('aria-hidden', 'true');
    
    // Styles für das Panel als Inline-Styles, um CSS-Konflikte zu vermeiden
    Object.assign(panel.style, {
      position: 'fixed',
      top: '20px',
      [widgetState.config.position]: '20px',
      width: '340px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      zIndex: '999998',
      opacity: '0',
      visibility: 'hidden',
      transform: 'translateY(-20px)',
      pointerEvents: 'auto',
      scrollBehavior: 'smooth'
    });
    
    // Panel-Inhalte erstellen
    panel.innerHTML = createPanelHTML();
    
    // Panel speichern und zum Container hinzufügen
    widgetState.panel = panel;
    target.appendChild(panel);
  }
  
  /**
   * HTML für das Panel erstellen
   * @returns {string} HTML-Inhalt für das Panel
   */
  function createPanelHTML() {
    const t = widgetState.translations;
    const prefix = widgetState.config.prefix;
    
    return `
      <div style="height: 100%; display: flex; flex-direction: column;">
        <!-- Panel-Header -->
        <div style="padding: 16px; border-bottom: 1px solid #eaeaea; display: flex; justify-content: space-between; align-items: center;">
          <h2 id="${prefix}panel-title" style="margin: 0; font-size: 16px; font-weight: bold;">${t.accessibilityMenu || 'Barrierefreiheit-Einstellungen'}</h2>
          <div style="display: flex; gap: 8px;">
            <button id="${prefix}reset-button" style="background: none; border: none; color: #666; text-decoration: underline; cursor: pointer; padding: 4px; font-size: 14px;">
              ${t.reset || 'Zurücksetzen'}
            </button>
            <button id="${prefix}close-button" style="background: none; border: none; color: #666; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 50%;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Tab-Navigation -->
        <div style="display: flex; border-bottom: 1px solid #eaeaea; background-color: #f9f9f9;">
          <button id="${prefix}tab-profiles" class="${prefix}tab-button ${prefix}tab-active" data-tab="profiles" style="flex: 1; padding: 12px 8px; border: none; background: none; cursor: pointer; position: relative;">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 4px;">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
              <span style="font-size: 12px;">${t.profiles || 'Profile'}</span>
            </div>
          </button>
          <!-- Weitere Tab-Buttons für Vision, Content, Navigation -->
        </div>
        
        <!-- Tab-Inhalte Container (scrollbar) -->
        <div style="flex: 1; overflow-y: auto;">
          <!-- Profile Tab Inhalt (standardmäßig sichtbar) -->
          <div id="${prefix}tab-content-profiles" class="${prefix}tab-content" style="display: block; padding: 16px;">
            <!-- Hier werden die Profile dynamisch eingefügt -->
          </div>
          
          <!-- Andere Tab-Inhalte (standardmäßig ausgeblendet) -->
          <div id="${prefix}tab-content-vision" class="${prefix}tab-content" style="display: none; padding: 16px;">
            <!-- Vision Tab Inhalt -->
          </div>
          
          <div id="${prefix}tab-content-content" class="${prefix}tab-content" style="display: none; padding: 16px;">
            <!-- Content Tab Inhalt -->
          </div>
          
          <div id="${prefix}tab-content-navigation" class="${prefix}tab-content" style="display: none; padding: 16px;">
            <!-- Navigation Tab Inhalt -->
          </div>
        </div>
        
        <!-- Panel-Footer -->
        <div style="padding: 12px 16px; border-top: 1px solid #eaeaea; text-align: center; font-size: 12px; color: #888;">
          ${t.poweredBy || 'Bereitgestellt von'} <a href="https://brandingbrothers.de" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: none;">brandingbrothers.de</a>
        </div>
      </div>
    `;
  }
  
  /**
   * Event-Listener registrieren
   */
  function bindEvents() {
    try {
      const prefix = widgetState.config.prefix;
      
      // Button-Klick zum Öffnen/Schließen
      widgetState.button.addEventListener('click', function(e) {
        e.stopPropagation(); // Verhindert Bubbling
        togglePanel();
      });
      
      // Shadow DOM oder direktes Element
      const container = window.A11yWidget.useShadowDOM ? window.A11yWidget.shadowRoot : document;
      
      // Reset- und Close-Buttons
      const resetButton = container.getElementById(prefix + 'reset-button');
      if (resetButton) {
        resetButton.addEventListener('click', function(e) {
          e.stopPropagation();
          resetSettings();
        });
      }
      
      const closeButton = container.getElementById(prefix + 'close-button');
      if (closeButton) {
        closeButton.addEventListener('click', function(e) {
          e.stopPropagation();
          togglePanel();
        });
      }
      
      // Tab-Buttons finden und Klick-Events hinzufügen
      const tabButtons = container.querySelectorAll(`.${prefix}tab-button`);
      tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          e.stopPropagation();
          const tabId = this.getAttribute('data-tab');
          switchTab(tabId);
        });
      });
      
      // Panels vor Bubbling schützen
      widgetState.panel.addEventListener('click', function(e) {
        e.stopPropagation();
      });
      
      // Klick außerhalb des Panels schließt es
      document.addEventListener('click', function(e) {
        if (widgetState.isOpen && 
            !isDescendantOf(e.target, widgetState.container) && 
            e.target !== widgetState.button) {
          togglePanel();
        }
      });
      
      // Escape-Taste schließt das Panel
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && widgetState.isOpen) {
          togglePanel();
        }
      });
    } catch (error) {
      console.warn('A11yWidget: Error binding events', error);
    }
  }
  
  /**
   * Prüft, ob ein Element Nachfahre eines anderen ist
   * @param {Element} child - Das zu prüfende Element
   * @param {Element} parent - Das vermutete Elternelement
   * @returns {boolean} True, wenn child ein Nachfahre von parent ist
   */
  function isDescendantOf(child, parent) {
    if (!child || !parent) return false;
    
    try {
      // Shadow DOM behandeln
      if (window.A11yWidget.useShadowDOM && window.A11yWidget.shadowRoot) {
        return window.A11yWidget.shadowRoot.contains(child);
      }
      
      // Normale DOM-Hierarchie
      let node = child.parentNode;
      while (node !== null) {
        if (node === parent) {
          return true;
        }
        node = node.parentNode;
      }
    } catch (error) {
      console.warn('A11yWidget: Error in descendant check', error);
    }
    
    return false;
  }
  
  /**
   * Panel öffnen/schließen
   */
  function togglePanel() {
    try {
      widgetState.isOpen = !widgetState.isOpen;
      
      if (widgetState.isOpen) {
        // Panel öffnen
        widgetState.panel.style.opacity = '1';
        widgetState.panel.style.visibility = 'visible';
        widgetState.panel.style.transform = 'translateY(0)';
        widgetState.panel.setAttribute('aria-hidden', 'false');
        widgetState.button.setAttribute('aria-expanded', 'true');
        
        // Analytics-Event für Panel-Öffnung
        sendAnalytics('panel_opened');
      } else {
        // Panel schließen
        widgetState.panel.style.opacity = '0';
        widgetState.panel.style.visibility = 'hidden';
        widgetState.panel.style.transform = 'translateY(-20px)';
        widgetState.panel.setAttribute('aria-hidden', 'true');
        widgetState.button.setAttribute('aria-expanded', 'false');
        
        // Analytics-Event für Panel-Schließung
        sendAnalytics('panel_closed');
      }
    } catch (error) {
      console.warn('A11yWidget: Error toggling panel', error);
    }
  }
  
  /**
   * Zwischen Tabs wechseln
   * @param {string} tabId - ID des anzuzeigenden Tabs
   */
  function switchTab(tabId) {
    try {
      const prefix = widgetState.config.prefix;
      
      // Aktiven Tab setzen
      widgetState.activeTab = tabId;
      
      // Shadow DOM oder direktes Element verwenden
      const container = window.A11yWidget.useShadowDOM ? window.A11yWidget.shadowRoot : document;
      
      // Alle Tab-Buttons und -Inhalte zurücksetzen
      const tabButtons = container.querySelectorAll(`.${prefix}tab-button`);
      tabButtons.forEach(button => {
        button.classList.remove(`${prefix}tab-active`);
        if (button.getAttribute('data-tab') === tabId) {
          button.classList.add(`${prefix}tab-active`);
        }
      });
      
      // Alle Tab-Inhalte ausblenden
      const tabContents = container.querySelectorAll(`.${prefix}tab-content`);
      tabContents.forEach(content => {
        content.style.display = 'none';
      });
      
      // Gewählten Tab-Inhalt einblenden
      const activeContent = container.getElementById(`${prefix}tab-content-${tabId}`);
      if (activeContent) {
        activeContent.style.display = 'block';
      }
      
      // Analytics-Event für Tab-Wechsel
      sendAnalytics('tab_switched', { tab: tabId });
    } catch (error) {
      console.warn('A11yWidget: Error switching tabs', error);
    }
  }
  
  /**
   * Einstellungen zurücksetzen
   */
  function resetSettings() {
    try {
      // Einstellungen auf Standardwerte zurücksetzen
      widgetState.currentSettings = Object.assign({}, widgetState.defaultSettings);
      
      // UI aktualisieren
      updateUI();
      
      // Einstellungen anwenden
      applySettings();
      
      // Analytics-Event für Zurücksetzen
      sendAnalytics('settings_reset');
    } catch (error) {
      console.warn('A11yWidget: Error resetting settings', error);
    }
  }
  
  /**
   * UI-Elemente anhand der aktuellen Einstellungen aktualisieren
   */
  function updateUI() {
    // Diese Funktion wird implementiert, wenn das vollständige UI erstellt ist
    // Sie aktualisiert alle interaktiven Elemente basierend auf widgetState.currentSettings
  }
  
  /**
   * Barrierefreiheits-Einstellungen auf die Website anwenden
   */
  function applySettings() {
    // Diese Funktion wird implementiert, um Einstellungen auf die Website anzuwenden
    // Sie erzeugt CSS und andere Änderungen basierend auf widgetState.currentSettings
  }
  
  /**
   * Analytics-Event an den Server senden
   * @param {string} event - Name des Events
   * @param {Object} data - Zusätzliche Daten zum Event
   */
  function sendAnalytics(event, data = {}) {
    try {
      if (!widgetState.config.apiBase || !widgetState.config.token) {
        return;
      }
      
      // Fetch API mit Timeout und Fehlerbehandlung
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      fetch(`${widgetState.config.apiBase}/api/widget/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: widgetState.config.token,
          event: event,
          timestamp: new Date().toISOString(),
          data: data,
          userAgent: navigator.userAgent
        }),
        signal: controller.signal,
        keepalive: true
      }).finally(() => {
        clearTimeout(timeoutId);
      }).catch(err => {
        // Fehler stillschweigend behandeln - keine Funktionsbeeinträchtigung
        if (err.name !== 'AbortError') {
          console.warn('A11yWidget: Analytics error', err);
        }
      });
    } catch (error) {
      // Fehler beim Senden der Analysedaten ignorieren
      console.warn('A11yWidget: Analytics sending error', error);
    }
  }
  
  /**
   * Öffentliche API
   */
  window.A11yWidget.init = init;
  window.A11yWidget.togglePanel = togglePanel;
  window.A11yWidget.resetSettings = resetSettings;
  window.A11yWidget.switchTab = switchTab;
  window.A11yWidget.applySettings = applySettings;
  
})(window, document);