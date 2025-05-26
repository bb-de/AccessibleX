/**
 * A11yWidget Custom Element
 * Isolierte Web-Komponente für maximale Kompatibilität mit Host-Seiten
 * Version 1.0.0
 */
(function() {
  'use strict';
  
  // Feature Detection für moderne Browser-Features
  const featureSupport = {
    shadowDOM: !!HTMLElement.prototype.attachShadow,
    customElements: !!window.customElements,
    intersectionObserver: !!window.IntersectionObserver,
    cssVariables: window.CSS && CSS.supports('color', 'var(--test)'),
    
    // Widget-Funktionen entsprechend anpassen
    getImplementation(feature) {
      return this[feature] ? 'modern' : 'fallback';
    }
  };
  
  // Überprüfen, ob bereits definiert
  if (!customElements.get('a11y-widget') && featureSupport.customElements) {
    
    class A11yWidgetElement extends HTMLElement {
      constructor() {
        super();
        
        // Private Eigenschaften
        this._config = {};
        this._initialized = false;
        this._eventListeners = [];
        this._styles = null;
        this._widgetReady = false;
        
        // Shadow DOM erstellen (wenn unterstützt)
        if (featureSupport.shadowDOM) {
          this._root = this.attachShadow({ mode: 'open' });
        } else {
          // Fallback ohne Shadow DOM
          this._root = this;
        }
      }
      
      /**
       * Wird aufgerufen, wenn das Element in das DOM eingefügt wird
       */
      connectedCallback() {
        if (!this._initialized) {
          // Widget initialisieren
          this._initialize();
        }
      }
      
      /**
       * Wird aufgerufen, wenn das Element aus dem DOM entfernt wird
       */
      disconnectedCallback() {
        // Ressourcen bereinigen
        this._cleanup();
      }
      
      /**
       * Beobachtete Attribute, die Änderungen auslösen
       */
      static get observedAttributes() {
        return ['data-position', 'data-lang', 'data-theme', 'data-token'];
      }
      
      /**
       * Wird bei Änderungen an beobachteten Attributen aufgerufen
       */
      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        // Konfiguration aktualisieren
        const configKey = name.replace('data-', '');
        this._config[configKey] = newValue;
        
        // Widget neu konfigurieren, wenn bereits initialisiert
        if (this._initialized) {
          this._updateConfiguration();
        }
      }
      
      /**
       * Widget initialisieren
       * @private
       */
      _initialize() {
        try {
          // Konfiguration laden
          this._loadConfiguration();
          
          // Grundstruktur erstellen
          this._createBaseStructure();
          
          // Event-Listener hinzufügen
          this._setupEventListeners();
          
          // Widget als initialisiert markieren
          this._initialized = true;
          
          // Event auslösen
          this._dispatchWidgetEvent('initialized', { success: true });
          
          // Vollständige Widget-Funktionalität verzögert laden (Lazy Loading)
          setTimeout(() => {
            this._loadFullFunctionality();
          }, 100);
        } catch (error) {
          console.warn('A11yWidget: Initialization error', error);
          this._dispatchWidgetEvent('error', { 
            phase: 'initialization',
            message: error.message 
          });
        }
      }
      
      /**
       * Konfiguration aus Attributen laden
       * @private
       */
      _loadConfiguration() {
        this._config = {
          position: this.getAttribute('data-position') || 'right',
          lang: this.getAttribute('data-lang') || 'de',
          theme: this.getAttribute('data-theme') || 'default',
          token: this.getAttribute('data-token') || '',
          prefix: 'a11y-widget-'
        };
        
        // Ausloggen für Debugging-Zwecke
        console.log('A11yWidget: Configuration loaded', Object.assign({}, this._config, { token: '[HIDDEN]' }));
      }
      
      /**
       * Grundstruktur für das Widget erstellen
       * @private
       */
      _createBaseStructure() {
        // CSS laden
        this._injectStyles();
        
        // Container erstellen
        const container = document.createElement('div');
        container.className = `${this._config.prefix}container`;
        container.setAttribute('data-a11y-widget', 'true');
        
        // Nur Button initial erstellen, Rest wird on-demand geladen
        const button = document.createElement('button');
        button.className = `${this._config.prefix}button`;
        button.setAttribute('aria-label', 'Barrierefreiheits-Einstellungen öffnen');
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.innerHTML = this._getAccessibilityIconSVG();
        
        // Zum Container hinzufügen
        container.appendChild(button);
        this._root.appendChild(container);
        
        // Referenzen speichern
        this._container = container;
        this._button = button;
      }
      
      /**
       * CSS-Styles in Shadow DOM oder Host injizieren
       * @private
       */
      _injectStyles() {
        const style = document.createElement('style');
        style.textContent = this._getBaseStyles();
        this._root.appendChild(style);
        this._styles = style;
      }
      
      /**
       * Event-Listener einrichten
       * @private
       */
      _setupEventListeners() {
        // Button-Click zum Öffnen des Panels
        this._addSafeEventListener(this._button, 'click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this._togglePanel();
        });
        
        // Keyboard-Zugang
        this._addSafeEventListener(this._button, 'keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            this._togglePanel();
          }
        });
      }
      
      /**
       * Sicherer Event-Listener, der zur späteren Säuberung registriert wird
       * @private
       */
      _addSafeEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        this._eventListeners.push({ element, event, handler, options });
      }
      
      /**
       * Panel öffnen/schließen
       * @private
       */
      _togglePanel() {
        // Hier wird später das Panel umgeschaltet
        // Erst muss das vollständige Widget geladen sein
        if (!this._widgetReady) {
          console.log('A11yWidget: Widget wird geladen, bitte warten...');
          return;
        }
        
        // Toggle-Funktionalität wird in der vollständigen Implementierung hinzugefügt
        if (typeof window.A11yWidget !== 'undefined' && typeof window.A11yWidget.togglePanel === 'function') {
          window.A11yWidget.togglePanel();
        } else {
          console.warn('A11yWidget: Panel kann nicht umgeschaltet werden, Widget noch nicht vollständig geladen');
        }
      }
      
      /**
       * Vollständige Widget-Funktionalität lazy laden
       * @private
       */
      _loadFullFunctionality() {
        const script = document.createElement('script');
        script.src = this._getWidgetScriptUrl();
        script.async = true;
        script.onload = () => {
          // Widget initialisieren, wenn es geladen ist
          if (typeof window.A11yWidget !== 'undefined' && typeof window.A11yWidget.init === 'function') {
            window.A11yWidget.init(this._config);
            this._widgetReady = true;
            this._dispatchWidgetEvent('ready', { success: true });
          } else {
            console.warn('A11yWidget: Hauptfunktionalität konnte nicht initialisiert werden');
            this._dispatchWidgetEvent('error', { 
              phase: 'loadFunctionality',
              message: 'Widget initialization function not found' 
            });
          }
        };
        script.onerror = (error) => {
          console.warn('A11yWidget: Hauptskript konnte nicht geladen werden', error);
          this._dispatchWidgetEvent('error', { 
            phase: 'loadScript',
            message: 'Failed to load widget script' 
          });
          
          // Fallback-Widget anzeigen
          this._showFallbackWidget();
        };
        
        // Skript zum Dokument hinzufügen
        document.body.appendChild(script);
      }
      
      /**
       * URL für das Widget-Hauptskript bestimmen
       * @private
       */
      _getWidgetScriptUrl() {
        // Wird später durch die tatsächliche URL ersetzt
        return '/widget-main.js';
      }
      
      /**
       * Basisstile für das Widget
       * @private
       */
      _getBaseStyles() {
        return `
          .${this._config.prefix}container {
            position: fixed;
            z-index: 999999;
            pointer-events: none;
            box-sizing: border-box;
          }
          
          .${this._config.prefix}container * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
          
          .${this._config.prefix}button {
            position: fixed;
            bottom: 20px;
            ${this._config.position}: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #0066cc;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border: none;
            outline: none;
            transition: transform 0.3s ease;
            pointer-events: auto;
            z-index: 999999;
            padding: 0;
          }
          
          .${this._config.prefix}button:hover {
            transform: scale(1.05);
          }
          
          .${this._config.prefix}button:focus {
            outline: 2px solid #ffffff;
            outline-offset: 2px;
          }
          
          .${this._config.prefix}fallback {
            position: fixed;
            bottom: 20px;
            ${this._config.position}: 20px;
            width: 300px;
            padding: 15px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-size: 14px;
            z-index: 999998;
            display: none;
            pointer-events: auto;
          }
        `;
      }
      
      /**
       * SVG-Icon für den Barrierefreiheits-Button
       * @private
       */
      _getAccessibilityIconSVG() {
        return `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="7" r="1"></circle>
            <path d="M9 12h6"></path>
            <path d="M12 12v6"></path>
          </svg>
        `;
      }
      
      /**
       * Fallback-Widget anzeigen, wenn die Hauptfunktionalität nicht geladen werden kann
       * @private
       */
      _showFallbackWidget() {
        // Fallback-Element erstellen
        const fallback = document.createElement('div');
        fallback.className = `${this._config.prefix}fallback`;
        fallback.innerHTML = `
          <div style="margin-bottom: 10px; font-weight: bold;">Barrierefreiheits-Widget</div>
          <p style="margin: 0 0 10px 0;">Das Barrierefreiheits-Widget konnte nicht vollständig geladen werden.</p>
          <button style="background: #0066cc; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Erneut versuchen</button>
          <button style="background: none; border: none; text-decoration: underline; cursor: pointer; padding: 5px 10px; color: #666;">Schließen</button>
        `;
        
        this._root.appendChild(fallback);
        this._fallback = fallback;
        this._fallback.style.display = 'block';
        
        // Event-Listener für Fallback-Buttons
        const buttons = fallback.querySelectorAll('button');
        if (buttons.length >= 2) {
          // Erneut versuchen
          this._addSafeEventListener(buttons[0], 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this._fallback.style.display = 'none';
            this._loadFullFunctionality();
          });
          
          // Schließen
          this._addSafeEventListener(buttons[1], 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this._fallback.style.display = 'none';
          });
        }
      }
      
      /**
       * Custom Event auslösen
       * @private
       */
      _dispatchWidgetEvent(name, detail = {}) {
        const event = new CustomEvent(`a11y-widget-${name}`, {
          bubbles: true,
          composed: true, // Aus dem Shadow DOM heraus
          detail
        });
        this.dispatchEvent(event);
      }
      
      /**
       * Ressourcen bereinigen
       * @private
       */
      _cleanup() {
        // Alle Event-Listener entfernen
        this._eventListeners.forEach(({ element, event, handler, options }) => {
          element.removeEventListener(event, handler, options);
        });
        this._eventListeners = [];
        
        this._dispatchWidgetEvent('destroyed');
        console.log('A11yWidget: Successfully cleaned up');
      }
      
      /**
       * Widget-Konfiguration aktualisieren
       * @private
       */
      _updateConfiguration() {
        // Existierendes Widget mit neuer Konfiguration aktualisieren
        if (typeof window.A11yWidget !== 'undefined' && typeof window.A11yWidget.updateConfig === 'function') {
          window.A11yWidget.updateConfig(this._config);
        }
        
        // Button-Position aktualisieren
        if (this._button) {
          this._button.style.left = this._config.position === 'left' ? '20px' : 'auto';
          this._button.style.right = this._config.position === 'right' ? '20px' : 'auto';
        }
      }
    }
    
    // Custom Element registrieren
    customElements.define('a11y-widget', A11yWidgetElement);
    
    console.log('A11yWidget: Custom element registered');
  } else {
    console.log('A11yWidget: Custom element already defined or not supported');
  }
})();