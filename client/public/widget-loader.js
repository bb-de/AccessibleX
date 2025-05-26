/**
 * Barrierefreiheit-Widget Loader (Advanced Version)
 * Sichere und konfliktfreie Integration in jede Webseite
 * Version 1.0.0
 */
(function(window, document) {
  'use strict';
  
  // Feature Detection für Browser-Funktionen
  const browserFeatures = {
    customElements: !!window.customElements,
    shadowDOM: !!HTMLElement.prototype.attachShadow,
    intersectionObserver: !!window.IntersectionObserver,
    mutationObserver: !!window.MutationObserver,
    cssVariables: window.CSS && CSS.supports('color', 'var(--test)'),
    fetch: !!window.fetch,
    templates: 'content' in document.createElement('template'),
    
    // Status für Kapselungsmethode
    encapsulation: 'unknown' // 'custom-element', 'shadow-dom', 'iframe', 'css-namespacing'
  };
  
  // Sicherer Namensraum für Widget
  const WIDGET_NAMESPACE = 'A11yWidget';
  
  // Konfiguration
  const config = {
    version: '1.0.0',
    prefix: 'a11y-widget-',
    zIndex: 999999,
    cdnBase: 'WIDGET_URL_PLACEHOLDER', // Wird durch Vercel URL ersetzt
    apiBase: 'API_BASE_PLACEHOLDER',    // Wird durch Vercel API URL ersetzt
    position: 'right',
    language: 'de',
    theme: 'default',
    token: '',
    hostUrl: window.location.href,
    loadTimeout: 8000,                  // Ladezeit-Timeout in ms
    retryDelay: 1500,                   // Verzögerung vor erneutem Versuch
    maxRetries: 2                       // Maximale Anzahl von Versuchen
  };
  
  // Privater Speicher für Widget-Zustände
  const widgetState = {
    initialized: false,
    loading: false,
    loadRetries: 0,
    domReady: false,
    resourcesLoaded: false,
    scriptLoaded: false,
    cssLoaded: false,
    container: null,
    customElementRegistered: false,
    abortController: null,
    listeners: [],
    errors: []
  };
  
  // ====================================================================
  // 1. DOM-Ready-Event und asynchrone Initialisierung
  // ====================================================================
  
  /**
   * Sicherstellen, dass das DOM geladen ist, bevor Widget initialisiert wird
   */
  function waitForDomReady() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          widgetState.domReady = true;
          resolve();
        });
      } else {
        widgetState.domReady = true;
        resolve();
      }
    });
  }
  
  /**
   * Widget-Initialisierung
   * Lädt alle Ressourcen und erstellt die Widget-Struktur
   */
  async function initialize() {
    if (widgetState.initialized || widgetState.loading) {
      return;
    }
    
    try {
      widgetState.loading = true;
      
      // 1. Konfiguration aus dem Script-Tag auslesen
      loadConfigFromScriptTag();
      
      // 2. Warten bis DOM bereit ist
      await waitForDomReady();
      
      // 3. Prüfen auf Konflikte und Browser-Kompatibilität
      const checkResult = checkForConflictsAndCompatibility();
      logDebug(`Conflict check result: ${checkResult.compatible ? 'Compatible' : 'Issues found'}`);
      
      // 4. Kapselungsmethode basierend auf Umgebung auswählen
      selectEncapsulationMethod(checkResult);
      
      // 5. Widget injizieren, je nach Kapselungsmethode
      injectWidget();
      
      widgetState.initialized = true;
      widgetState.loading = false;
      
      // 6. Event auslösen
      dispatchWidgetEvent('initialized', { 
        config: { ...config, token: '[HIDDEN]' },
        encapsulation: browserFeatures.encapsulation
      });
      
      logDebug('Widget initialization completed successfully');
    } catch (error) {
      widgetState.loading = false;
      widgetState.errors.push({
        phase: 'initialization',
        message: error.message,
        time: new Date().toISOString()
      });
      
      logError('Initialization error', error);
      
      // Fallback-Mechanismus auslösen
      handleInitializationError(error);
    }
  }
  
  /**
   * Konfiguration aus dem Script-Tag laden
   */
  function loadConfigFromScriptTag() {
    try {
      const scriptTag = findCurrentScriptTag();
      
      if (scriptTag) {
        // Konfigurationsattribute auslesen
        config.position = scriptTag.getAttribute('data-position') || config.position;
        config.language = scriptTag.getAttribute('data-lang') || config.language;
        config.theme = scriptTag.getAttribute('data-theme') || config.theme;
        config.token = scriptTag.getAttribute('data-token') || config.token;
        
        // Debug-Modus prüfen
        if (scriptTag.hasAttribute('data-debug')) {
          config.debug = scriptTag.getAttribute('data-debug') === 'true';
        }
      }
      
      logDebug('Configuration loaded', { ...config, token: '[HIDDEN]' });
    } catch (error) {
      logError('Error loading configuration from script tag', error);
    }
  }

  /**
   * Aktuelles Script-Tag finden
   */
  function findCurrentScriptTag() {
    // Methode 1: document.currentScript (modern)
    if (document.currentScript) {
      return document.currentScript;
    }
    
    // Methode 2: Alle Script-Tags durchsuchen
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src || '';
      if (src.includes('widget-loader.js') || src.includes('a11y-widget')) {
        return scripts[i];
      }
    }
    
    // Methode 3: Durch Error-Stack-Parsing (komplexer, nur Fallback)
    try {
      throw new Error('Find script');
    } catch (err) {
      const stackLines = err.stack.split('\\n');
      const scriptPathRegex = /(.+?\/widget-loader\.js)/i;
      
      for (let line of stackLines) {
        const match = line.match(scriptPathRegex);
        if (match) {
          const scriptUrl = match[1];
          for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src.includes(scriptUrl)) {
              return scripts[i];
            }
          }
        }
      }
    }
    
    return null;
  }

  // ====================================================================
  // 2. Konflikt- und Kompatibilitätsprüfung
  // ====================================================================
  
  /**
   * Prüfen auf mögliche Konflikte und Browser-Kompatibilität
   */
  function checkForConflictsAndCompatibility() {
    const result = {
      compatible: true,
      issues: [],
      conflicts: [],
      unsupportedFeatures: []
    };
    
    // 1. JavaScript-Namensraum-Konflikt prüfen
    if (window[WIDGET_NAMESPACE] !== undefined) {
      result.conflicts.push({
        type: 'namespace',
        description: `Global namespace ${WIDGET_NAMESPACE} is already defined`
      });
    }
    
    // 2. Basis-Browser-Funktionen prüfen
    const requiredFeatures = ['customElements', 'shadowDOM', 'fetch'];
    for (let feature of requiredFeatures) {
      if (!browserFeatures[feature]) {
        result.unsupportedFeatures.push(feature);
        result.compatible = false;
      }
    }
    
    // 3. DOM-Test für CSS-Konflikte
    testForCssConflicts(result);
    
    // 4. Prüfen auf bekannte Konflikte mit anderen Bibliotheken
    testForKnownLibraryConflicts(result);
    
    // 5. Content Security Policy prüfen
    testForCSPRestrictions(result);
    
    return result;
  }
  
  /**
   * Testet auf CSS-Konflikte
   */
  function testForCssConflicts(result) {
    try {
      // Test-Element erstellen
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.opacity = '0';
      testElement.style.pointerEvents = 'none';
      testElement.className = `${config.prefix}test`;
      testElement.textContent = 'A11y Widget Test';
      document.body.appendChild(testElement);
      
      // Berechnen der tatsächlichen Stile
      const computedStyle = window.getComputedStyle(testElement);
      
      // Prüfen, ob unsere Styles überschrieben wurden
      if (computedStyle.position !== 'absolute' || 
          computedStyle.opacity !== '0' ||
          computedStyle.pointerEvents !== 'none') {
        result.conflicts.push({
          type: 'css-reset',
          description: 'Website CSS is overriding basic plugin styles'
        });
      }
      
      // Test-Element entfernen
      document.body.removeChild(testElement);
    } catch (error) {
      logError('Error during CSS conflict test', error);
    }
  }
  
  /**
   * Testet auf bekannte Konflikte mit anderen Bibliotheken
   */
  function testForKnownLibraryConflicts(result) {
    // Bekannte problematische Bibliotheken
    const problematicLibraries = [
      { name: 'accessibilityTools', global: 'accessibilityTools' },
      { name: 'a11yTools', global: 'a11yTools' },
      { name: 'webAccessibility', global: 'webAccessibility' }
    ];
    
    for (let lib of problematicLibraries) {
      if (window[lib.global] !== undefined) {
        result.conflicts.push({
          type: 'library-conflict',
          description: `Detected potentially conflicting library: ${lib.name}`
        });
      }
    }
    
    // Unverträgliche Frameworks erkennen
    if (typeof window.jQuery !== 'undefined') {
      // jQuery ist vorhanden, Version prüfen
      const jQueryVersion = window.jQuery.fn.jquery.split('.')[0];
      if (parseInt(jQueryVersion, 10) < 2) {
        result.issues.push({
          type: 'outdated-jquery',
          description: `Found jQuery version ${window.jQuery.fn.jquery}, might cause compatibility issues`
        });
      }
    }
  }
  
  /**
   * Testet auf Content Security Policy Einschränkungen
   */
  function testForCSPRestrictions(result) {
    // CSP-Header prüfen, wenn verfügbar
    const cspMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMetaTag) {
      const cspContent = cspMetaTag.getAttribute('content') || '';
      
      // Prüfen, ob inline-scripts blockiert werden
      if (cspContent.includes("script-src") && 
          !cspContent.includes("'unsafe-inline'") && 
          !cspContent.includes("'unsafe-eval'")) {
        result.issues.push({
          type: 'csp-restriction',
          description: 'CSP may block inline scripts or dynamic code execution'
        });
      }
      
      // Prüfen, ob externe Ressourcen blockiert werden könnten
      const cdnDomain = new URL(config.cdnBase || 'https://example.com').hostname;
      if (cspContent.includes("connect-src") && !cspContent.includes(cdnDomain)) {
        result.issues.push({
          type: 'csp-restriction',
          description: `CSP may block connections to widget CDN (${cdnDomain})`
        });
      }
    }
  }

  // ====================================================================
  // 3. Kapselungsmethode auswählen
  // ====================================================================
  
  /**
   * Wählt die optimale Kapselungsmethode basierend auf Browser-Features und Umgebung
   */
  function selectEncapsulationMethod(checkResult) {
    // Ideale Methode: Custom Elements + Shadow DOM
    if (browserFeatures.customElements && browserFeatures.shadowDOM && !checkResult.conflicts.some(c => c.type === 'namespace')) {
      browserFeatures.encapsulation = 'custom-element';
      logDebug('Using Custom Elements + Shadow DOM for encapsulation');
      return;
    }
    
    // Alternative Methode: Shadow DOM ohne Custom Elements
    if (browserFeatures.shadowDOM) {
      browserFeatures.encapsulation = 'shadow-dom';
      logDebug('Using Shadow DOM for encapsulation');
      return;
    }
    
    // Fallback-Methode: CSS-Namensraum
    browserFeatures.encapsulation = 'css-namespacing';
    logDebug('Using CSS namespacing for encapsulation (fallback)');
  }

  // ====================================================================
  // 4. Widget-Injektion je nach Kapselungsmethode
  // ====================================================================
  
  /**
   * Widget injizieren, abhängig von gewählter Kapselungsmethode
   */
  function injectWidget() {
    switch (browserFeatures.encapsulation) {
      case 'custom-element':
        injectWidgetAsCustomElement();
        break;
      case 'shadow-dom':
        injectWidgetWithShadowDOM();
        break;
      case 'css-namespacing':
        injectWidgetWithCSSNamespacing();
        break;
      default:
        injectWidgetWithCSSNamespacing(); // Fallback
    }
  }
  
  /**
   * Widget als Web Component (Custom Element) injizieren
   */
  function injectWidgetAsCustomElement() {
    try {
      // Nur Widget-Element laden, der Rest passiert im Custom Element
      loadScript(`${config.cdnBase}/widget-element.js`)
        .then(() => {
          // Prüfen ob Custom Element bereits registriert ist
          if (widgetState.customElementRegistered || customElements.get('a11y-widget')) {
            widgetState.customElementRegistered = true;
            
            // Element erstellen und konfigurieren
            const widget = document.createElement('a11y-widget');
            widget.setAttribute('data-position', config.position);
            widget.setAttribute('data-lang', config.language);
            widget.setAttribute('data-theme', config.theme);
            widget.setAttribute('data-token', config.token);
            
            // Element zum DOM hinzufügen
            document.body.appendChild(widget);
            widgetState.container = widget;
            
            logDebug('Widget custom element injected into DOM');
          } else {
            throw new Error('Custom element not registered after loading widget-element.js');
          }
        })
        .catch(error => {
          logError('Error injecting widget as custom element', error);
          // Fallback auf einfachere Methode
          injectWidgetWithCSSNamespacing();
        });
    } catch (error) {
      logError('Error in custom element injection', error);
      // Fallback
      injectWidgetWithCSSNamespacing();
    }
  }
  
  /**
   * Widget mit Shadow DOM, aber ohne Custom Element injizieren
   */
  function injectWidgetWithShadowDOM() {
    try {
      // Container erstellen
      const container = document.createElement('div');
      container.id = `${config.prefix}container`;
      
      // Shadow DOM anhängen
      const shadow = container.attachShadow({ mode: 'open' });
      
      // Basis-HTML in Shadow DOM einfügen
      shadow.innerHTML = `
        <div class="${config.prefix}wrapper">
          <button class="${config.prefix}button" aria-label="Barrierefreiheits-Einstellungen öffnen">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="7" r="1"></circle>
              <path d="M9 12h6"></path>
              <path d="M12 12v6"></path>
            </svg>
          </button>
        </div>
      `;
      
      // CSS in Shadow DOM injizieren
      const style = document.createElement('style');
      style.textContent = getBaseStyles();
      shadow.insertBefore(style, shadow.firstChild);
      
      // Container zum DOM hinzufügen
      document.body.appendChild(container);
      widgetState.container = container;
      
      // Event-Listener hinzufügen
      const button = shadow.querySelector(`.${config.prefix}button`);
      if (button) {
        addSafeEventListener(button, 'click', handleButtonClick);
      }
      
      // Weitere Ressourcen laden
      Promise.all([
        loadCSS(`${config.cdnBase}/widget-styles.css`, shadow),
        loadScript(`${config.cdnBase}/widget-main.js`)
      ]).then(() => {
        logDebug('Widget resources loaded successfully');
        initializeWidgetFunctionality();
      }).catch(error => {
        logError('Error loading widget resources', error);
      });
      
      logDebug('Widget injected with Shadow DOM');
    } catch (error) {
      logError('Error injecting widget with Shadow DOM', error);
      // Fallback
      injectWidgetWithCSSNamespacing();
    }
  }
  
  /**
   * Widget mit CSS-Namensraum-Isolation injizieren (einfachste, aber am wenigsten isolierte Methode)
   */
  function injectWidgetWithCSSNamespacing() {
    try {
      // Container erstellen
      const container = document.createElement('div');
      container.id = `${config.prefix}container`;
      container.className = `${config.prefix}container`;
      container.setAttribute('data-a11y-widget', 'true');
      
      // Button erstellen
      const button = document.createElement('button');
      button.id = `${config.prefix}button`;
      button.className = `${config.prefix}button`;
      button.setAttribute('aria-label', 'Barrierefreiheits-Einstellungen öffnen');
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="7" r="1"></circle>
          <path d="M9 12h6"></path>
          <path d="M12 12v6"></path>
        </svg>
      `;
      
      // Inline-Styles für Container, um sicherzustellen, dass sie nicht überschrieben werden
      Object.assign(container.style, {
        position: 'fixed',
        zIndex: config.zIndex.toString(),
        pointerEvents: 'none'
      });
      
      // Inline-Styles für Button
      Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        [config.position]: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#0066cc',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        border: 'none',
        outline: 'none',
        transition: 'transform 0.3s ease',
        pointerEvents: 'auto',
        zIndex: config.zIndex.toString(),
        padding: '0'
      });
      
      // Event-Listener hinzufügen
      addSafeEventListener(button, 'click', handleButtonClick);
      
      // Elemente zusammensetzen und zum DOM hinzufügen
      container.appendChild(button);
      document.body.appendChild(container);
      widgetState.container = container;
      
      // CSS und Script laden
      Promise.all([
        loadCSS(`${config.cdnBase}/widget-styles.css`),
        loadScript(`${config.cdnBase}/widget-main.js`)
      ]).then(() => {
        logDebug('Widget resources loaded successfully');
        initializeWidgetFunctionality();
      }).catch(error => {
        logError('Error loading widget resources', error);
      });
      
      logDebug('Widget injected with CSS namespacing');
    } catch (error) {
      logError('Error injecting widget with CSS namespacing', error);
      handleInitializationError(error);
    }
  }

  // ====================================================================
  // 5. Ressourcen-Lade-Funktionen
  // ====================================================================
  
  /**
   * CSS-Ressourcen laden
   */
  function loadCSS(url, target = document.head) {
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        
        link.onload = () => {
          widgetState.cssLoaded = true;
          logDebug(`CSS loaded: ${url}`);
          resolve();
        };
        
        link.onerror = (error) => {
          logError(`Failed to load CSS: ${url}`, error);
          reject(new Error(`Failed to load CSS: ${url}`));
        };
        
        target.appendChild(link);
        
        // Timeout für den Fall, dass onload nicht feuert
        setTimeout(() => {
          if (!widgetState.cssLoaded) {
            logDebug(`CSS load timeout, assuming success: ${url}`);
            resolve();
          }
        }, config.loadTimeout);
      } catch (error) {
        logError(`Error loading CSS: ${url}`, error);
        reject(error);
      }
    });
  }
  
  /**
   * JavaScript-Ressourcen laden
   */
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          widgetState.scriptLoaded = true;
          logDebug(`Script loaded: ${url}`);
          resolve();
        };
        
        script.onerror = (error) => {
          logError(`Failed to load script: ${url}`, error);
          
          // Retry-Logik
          if (widgetState.loadRetries < config.maxRetries) {
            widgetState.loadRetries++;
            logDebug(`Retrying script load (${widgetState.loadRetries}/${config.maxRetries}): ${url}`);
            
            setTimeout(() => {
              loadScript(url).then(resolve).catch(reject);
            }, config.retryDelay);
          } else {
            reject(new Error(`Failed to load script after ${config.maxRetries} attempts: ${url}`));
          }
        };
        
        document.body.appendChild(script);
      } catch (error) {
        logError(`Error loading script: ${url}`, error);
        reject(error);
      }
    });
  }
  
  /**
   * Widget-Funktionalität initialisieren, nachdem Ressourcen geladen sind
   */
  function initializeWidgetFunctionality() {
    try {
      if (typeof window[WIDGET_NAMESPACE] !== 'undefined' && typeof window[WIDGET_NAMESPACE].init === 'function') {
        window[WIDGET_NAMESPACE].init({
          position: config.position,
          language: config.language,
          theme: config.theme,
          token: config.token,
          prefix: config.prefix,
          apiBase: config.apiBase
        });
        
        logDebug('Widget functionality initialized');
      } else {
        throw new Error('Widget namespace or init function not found');
      }
    } catch (error) {
      logError('Error initializing widget functionality', error);
    }
  }

  // ====================================================================
  // 6. Event-Handling und Interaktionen
  // ====================================================================
  
  /**
   * Button-Klick-Handler
   */
  function handleButtonClick(event) {
    try {
      event.preventDefault();
      event.stopPropagation();
      
      if (typeof window[WIDGET_NAMESPACE] !== 'undefined' && typeof window[WIDGET_NAMESPACE].togglePanel === 'function') {
        window[WIDGET_NAMESPACE].togglePanel();
      } else {
        logDebug('Toggle function not available yet, widget might still be loading');
      }
    } catch (error) {
      logError('Error handling button click', error);
    }
  }
  
  /**
   * Sicherer Event-Listener hinzufügen, der Referenz speichert für späteres Entfernen
   */
  function addSafeEventListener(element, event, handler, options) {
    if (!element) return null;
    
    try {
      element.addEventListener(event, handler, options);
      
      // Listener zur Verwaltung hinzufügen
      const listenerEntry = { element, event, handler, options };
      widgetState.listeners.push(listenerEntry);
      
      return listenerEntry;
    } catch (error) {
      logError(`Error adding event listener: ${event}`, error);
      return null;
    }
  }
  
  /**
   * Alle Event-Listener entfernen und Ressourcen bereinigen
   */
  function cleanup() {
    try {
      // Event-Listener entfernen
      widgetState.listeners.forEach(({ element, event, handler, options }) => {
        if (element) {
          element.removeEventListener(event, handler, options);
        }
      });
      widgetState.listeners = [];
      
      // Laufende Anfragen abbrechen
      if (widgetState.abortController) {
        widgetState.abortController.abort();
      }
      
      // Widget-Funktion zurücksetzen
      if (typeof window[WIDGET_NAMESPACE] !== 'undefined' && typeof window[WIDGET_NAMESPACE].cleanup === 'function') {
        window[WIDGET_NAMESPACE].cleanup();
      }
      
      logDebug('Widget resources cleaned up');
    } catch (error) {
      logError('Error during cleanup', error);
    }
  }
  
  /**
   * Custom Event zum Kommunizieren mit dem Host-Dokument auslösen
   */
  function dispatchWidgetEvent(name, detail = {}) {
    try {
      // Event mit Namespace erzeugen
      const eventName = `${config.prefix}${name}`;
      const event = new CustomEvent(eventName, {
        bubbles: true,
        cancelable: true,
        composed: true, // Erlaubt das Verlassen des Shadow DOM
        detail
      });
      
      // Am Container oder Document auslösen
      if (widgetState.container) {
        widgetState.container.dispatchEvent(event);
      } else {
        document.dispatchEvent(event);
      }
      
      logDebug(`Event dispatched: ${eventName}`, detail);
    } catch (error) {
      logError(`Error dispatching event: ${name}`, error);
    }
  }

  // ====================================================================
  // 7. Fehlerbehandlung und Fallback-Mechanismen
  // ====================================================================
  
  /**
   * Initialisierungsfehler behandeln und Fallback anbieten
   */
  function handleInitializationError(error) {
    try {
      logError('Widget initialization failed, attempting fallback', error);
      
      // Minimales Fallback-Widget erstellen
      const fallbackContainer = document.createElement('div');
      fallbackContainer.id = `${config.prefix}fallback`;
      fallbackContainer.setAttribute('role', 'alert');
      
      // Inline-Styles für absolut notwendige Darstellung
      Object.assign(fallbackContainer.style, {
        position: 'fixed',
        bottom: '20px',
        [config.position]: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#0066cc',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        zIndex: '999999',
        fontSize: '24px'
      });
      
      fallbackContainer.innerHTML = '♿';
      
      // Tooltip bei Hover anzeigen
      let tooltip = null;
      
      fallbackContainer.addEventListener('mouseenter', () => {
        tooltip = document.createElement('div');
        Object.assign(tooltip.style, {
          position: 'fixed',
          bottom: '90px',
          [config.position]: '20px',
          padding: '8px 12px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '14px',
          maxWidth: '200px',
          zIndex: '999999'
        });
        tooltip.textContent = 'Barrierefreiheits-Widget konnte nicht vollständig geladen werden.';
        document.body.appendChild(tooltip);
      });
      
      fallbackContainer.addEventListener('mouseleave', () => {
        if (tooltip) {
          document.body.removeChild(tooltip);
          tooltip = null;
        }
      });
      
      // Klick zeigt Fehlermeldung
      fallbackContainer.addEventListener('click', () => {
        alert('Das Barrierefreiheits-Widget konnte nicht geladen werden. Bitte laden Sie die Seite neu oder kontaktieren Sie den Website-Betreiber.');
      });
      
      // Zum DOM hinzufügen
      document.body.appendChild(fallbackContainer);
      
      // Event senden
      dispatchWidgetEvent('fallback-loaded', {
        error: error.message
      });
    } catch (fallbackError) {
      logError('Failed to create fallback widget', fallbackError);
    }
  }

  // ====================================================================
  // 8. Basis-Stile für Widget-Komponenten
  // ====================================================================
  
  /**
   * Basis-CSS-Styles für Widget
   */
  function getBaseStyles() {
    return `
      .${config.prefix}wrapper {
        position: fixed;
        z-index: ${config.zIndex};
        pointer-events: none;
      }
      
      .${config.prefix}button {
        position: fixed;
        bottom: 20px;
        ${config.position}: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #0066cc;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        border: none;
        outline: none;
        transition: transform 0.3s ease;
        pointer-events: auto;
        z-index: ${config.zIndex};
        padding: 0;
      }
      
      .${config.prefix}button:hover {
        transform: scale(1.05);
      }
      
      .${config.prefix}button:focus {
        outline: 2px solid #ffffff;
        outline-offset: 2px;
      }
      
      .${config.prefix}button svg {
        width: 24px;
        height: 24px;
      }
    `;
  }

  // ====================================================================
  // 9. Hilfsfunktionen für Logging und Debugging
  // ====================================================================
  
  /**
   * Debug-Logging, nur wenn debug-Modus aktiviert
   */
  function logDebug(message, data = null) {
    if (config.debug) {
      const logMessage = `[${WIDGET_NAMESPACE}] ${message}`;
      if (data) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  }
  
  /**
   * Fehlermeldungen loggen
   */
  function logError(message, error = null) {
    const errorMessage = `[${WIDGET_NAMESPACE} Error] ${message}`;
    if (error) {
      console.error(errorMessage, error);
    } else {
      console.error(errorMessage);
    }
  }

  // ====================================================================
  // 10. Öffentliche Widget-API
  // ====================================================================
  
  // Öffentliche API
  window[WIDGET_NAMESPACE] = window[WIDGET_NAMESPACE] || {};
  
  // Öffentliche Methoden
  Object.assign(window[WIDGET_NAMESPACE], {
    // Hauptmethoden
    load: initialize,
    cleanup: cleanup,
    
    // Informationen
    version: config.version,
    getState: () => ({ ...widgetState }),
    getConfig: () => ({ ...config, token: '[HIDDEN]' }),
    getErrors: () => [...widgetState.errors],
    
    // Debug-Hilfsfunktionen
    debug: (enableDebug = true) => {
      config.debug = enableDebug;
      logDebug(`Debug mode ${enableDebug ? 'enabled' : 'disabled'}`);
    }
  });

  // ====================================================================
  // 11. Widget-Initialisierung ausführen
  // ====================================================================
  
  // Widget beim DOMContentLoaded oder sofort initialisieren
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // Minimale Verzögerung, um nicht das Laden der Seite zu blockieren
    setTimeout(initialize, 10);
  }
  
})(window, document);