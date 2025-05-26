/**
 * Barrierefreiheits-Widget Hilfsfunktionen
 * Isolierte Implementierung von Barrierefreiheits-Funktionen
 * Version 1.0.0
 */
(function(window, document) {
  'use strict';
  
  // Namespace für Helper-Funktionen
  window.A11yWidget = window.A11yWidget || {};
  window.A11yWidget.helpers = window.A11yWidget.helpers || {};
  
  // ====================================================================
  // Hilfsfunktionen für Text- und Kontrastanpassungen
  // ====================================================================
  
  /**
   * CSS für Kontrastmodus generieren
   * @param {string} mode - Kontrastmodus (default, increased, high, dark, light)
   * @returns {string} CSS-String für den gewählten Kontrastmodus
   */
  function getContrastModeStyles(mode) {
    switch (mode) {
      case 'increased':
        return `
          html { filter: contrast(1.2) !important; }
          body, p, div, span, h1, h2, h3, h4, h5, h6 { 
            color: #000000 !important;
            background-color: #ffffff !important;
          }
          a { color: #0000cc !important; font-weight: bold !important; }
        `;
      case 'high':
        return `
          html { filter: contrast(1.4) !important; }
          body { 
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          p, div, span, h1, h2, h3, h4, h5, h6 { 
            color: #000000 !important;
            background-color: #ffffff !important;
          }
          a { 
            color: #0000cc !important; 
            font-weight: bold !important;
            text-decoration: underline !important;
          }
          img, svg, button { filter: contrast(1.4) !important; }
        `;
      case 'dark':
        return `
          html { filter: brightness(0.8) !important; }
          body { 
            background-color: #222222 !important;
            color: #ffffff !important;
          }
          p, div, span, h1, h2, h3, h4, h5, h6 { 
            color: #ffffff !important;
            background-color: #222222 !important;
          }
          a { 
            color: #99ccff !important; 
            font-weight: bold !important;
          }
        `;
      case 'light':
        return `
          html { filter: brightness(1.1) !important; }
          body { 
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          p, div, span, h1, h2, h3, h4, h5, h6 { 
            color: #000000 !important;
            background-color: #ffffff !important;
          }
          a { color: #0000cc !important; }
        `;
      default:
        return ''; // Standardmodus
    }
  }
  
  /**
   * CSS für Schriftfamilie generieren
   * @param {string} family - Schriftfamilie (default, readable, dyslexic)
   * @returns {string} CSS-String für die gewählte Schriftfamilie
   */
  function getFontFamilyStyles(family) {
    switch (family) {
      case 'readable':
        return `
          body, p, div, span, h1, h2, h3, h4, h5, h6, button, input, select, textarea {
            font-family: Arial, Helvetica, sans-serif !important;
          }
        `;
      case 'dyslexic':
        return `
          @font-face {
            font-family: 'OpenDyslexic';
            src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff') format('woff');
            font-weight: normal;
            font-style: normal;
          }
          body, p, div, span, h1, h2, h3, h4, h5, h6, button, input, select, textarea {
            font-family: 'OpenDyslexic', Arial, sans-serif !important;
            line-height: 1.5 !important;
            letter-spacing: 0.05em !important;
          }
        `;
      default:
        return ''; // Standard-Schriftfamilie
    }
  }
  
  /**
   * CSS für Text-Alignment generieren
   * @param {string} align - Text-Ausrichtung (default, left, center, right)
   * @returns {string} CSS-String für die gewählte Text-Ausrichtung
   */
  function getTextAlignStyles(align) {
    switch (align) {
      case 'left':
        return `
          body, p, div, h1, h2, h3, h4, h5, h6 {
            text-align: left !important;
          }
        `;
      case 'center':
        return `
          body, p, div, h1, h2, h3, h4, h5, h6 {
            text-align: center !important;
          }
        `;
      case 'right':
        return `
          body, p, div, h1, h2, h3, h4, h5, h6 {
            text-align: right !important;
          }
        `;
      default:
        return ''; // Standard-Ausrichtung
    }
  }
  
  /**
   * CSS für Text-Größe generieren
   * @param {number} size - Textgröße-Faktor (0-5)
   * @returns {string} CSS-String für die gewählte Textgröße
   */
  function getTextSizeStyles(size) {
    const scaleFactor = 1 + (size * 0.2);
    return `
      html { font-size: ${scaleFactor}em !important; }
      body, p, div, span, button, input, select, textarea {
        font-size: ${scaleFactor}em !important;
      }
      h1 { font-size: ${2 * scaleFactor}em !important; }
      h2 { font-size: ${1.8 * scaleFactor}em !important; }
      h3 { font-size: ${1.6 * scaleFactor}em !important; }
      h4 { font-size: ${1.4 * scaleFactor}em !important; }
      h5 { font-size: ${1.2 * scaleFactor}em !important; }
      h6 { font-size: ${1.1 * scaleFactor}em !important; }
      small { font-size: ${0.8 * scaleFactor}em !important; }
    `;
  }
  
  /**
   * CSS für Zeilenabstand generieren
   * @param {number} height - Zeilenabstand-Faktor (0-5)
   * @returns {string} CSS-String für den gewählten Zeilenabstand
   */
  function getLineHeightStyles(height) {
    const lineHeight = 1.5 + (height * 0.3);
    return `
      body, p, div, span, li, h1, h2, h3, h4, h5, h6 {
        line-height: ${lineHeight} !important;
      }
    `;
  }
  
  /**
   * CSS für Buchstabenabstand generieren
   * @param {number} spacing - Buchstabenabstand-Faktor (0-5)
   * @returns {string} CSS-String für den gewählten Buchstabenabstand
   */
  function getLetterSpacingStyles(spacing) {
    const letterSpacing = spacing * 0.05;
    return `
      body, p, div, span, h1, h2, h3, h4, h5, h6, button, input, select, textarea {
        letter-spacing: ${letterSpacing}em !important;
      }
    `;
  }
  
  /**
   * CSS für Wortabstand generieren
   * @param {number} spacing - Wortabstand-Faktor (0-5)
   * @returns {string} CSS-String für den gewählten Wortabstand
   */
  function getWordSpacingStyles(spacing) {
    const wordSpacing = spacing * 0.2;
    return `
      body, p, div, span, h1, h2, h3, h4, h5, h6, button, input, select, textarea {
        word-spacing: ${wordSpacing}em !important;
      }
    `;
  }
  
  /**
   * CSS für Farbanpassungen generieren
   * @param {Object} colors - Farbobjekt mit Farbwerten
   * @returns {string} CSS-String für die gewählten Farben
   */
  function getColorStyles(colors) {
    let css = '';
    
    if (colors.textColor && colors.textColor !== 'default') {
      css += `
        body, p, div, span, li, td, th {
          color: ${getColorValue(colors.textColor)} !important;
        }
      `;
    }
    
    if (colors.titleColor && colors.titleColor !== 'default') {
      css += `
        h1, h2, h3, h4, h5, h6 {
          color: ${getColorValue(colors.titleColor)} !important;
        }
      `;
    }
    
    if (colors.backgroundColor && colors.backgroundColor !== 'default') {
      css += `
        body {
          background-color: ${getColorValue(colors.backgroundColor)} !important;
        }
      `;
    }
    
    return css;
  }
  
  /**
   * Farbwert basierend auf Farbcode zurückgeben
   * @param {string} colorCode - Farbcode (z.B. 'blue', 'red', usw.)
   * @returns {string} HEX-Farbwert
   */
  function getColorValue(colorCode) {
    const colorMap = {
      'blue': '#0066cc',
      'purple': '#6600cc',
      'red': '#cc0000',
      'orange': '#ff6600',
      'teal': '#008080',
      'green': '#006600',
      'white': '#ffffff',
      'black': '#000000'
    };
    
    return colorMap[colorCode] || '#333333';
  }
  
  // ====================================================================
  // Hilfsfunktionen für Navigationshilfen
  // ====================================================================
  
  /**
   * Tastaturnavigation aktivieren/verbessern
   */
  function enableKeyboardNavigation() {
    const css = `
      a:focus, button:focus, input:focus, select:focus, textarea:focus, [tabindex]:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 3px !important;
      }
    `;
    createAndAddStylesheet(css, 'a11y-keyboard-navigation-styles');
    
    // Tastatur-Event-Listener hinzufügen
    document.addEventListener('keydown', handleKeyboardNavigation);
  }
  
  /**
   * Tastatur-Navigation-Handler
   * @param {KeyboardEvent} e - Tastatur-Event
   */
  function handleKeyboardNavigation(e) {
    // Tab-Fokus hervorheben
    if (e.key === 'Tab') {
      document.body.classList.add('a11y-using-keyboard');
    }
    
    // Escape-Taste schließt Dialoge
    if (e.key === 'Escape') {
      const dialogs = document.querySelectorAll('dialog, [role="dialog"]');
      dialogs.forEach(dialog => {
        if (dialog.open) {
          dialog.close();
        }
      });
    }
    
    // Pfeil nach unten/oben für Scrollen
    if (e.altKey) {
      if (e.key === 'ArrowDown') {
        window.scrollBy(0, 100);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        window.scrollBy(0, -100);
        e.preventDefault();
      }
    }
  }
  
  /**
   * Tastaturnavigation deaktivieren
   */
  function disableKeyboardNavigation() {
    const stylesheet = document.getElementById('a11y-keyboard-navigation-styles');
    if (stylesheet) {
      stylesheet.remove();
    }
    
    document.removeEventListener('keydown', handleKeyboardNavigation);
    document.body.classList.remove('a11y-using-keyboard');
  }
  
  /**
   * Focus-Hervorhebungen aktivieren
   */
  function enableFocusHighlight() {
    const css = `
      *:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 3px !important;
      }
      
      a:focus, button:focus, input:focus, select:focus, textarea:focus {
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.6) !important;
      }
      
      /* Zusätzlicher visueller Indikator */
      *:focus::after {
        content: '';
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border: 2px solid #0066cc;
        border-radius: 3px;
        pointer-events: none;
      }
    `;
    createAndAddStylesheet(css, 'a11y-focus-highlight-styles');
  }
  
  /**
   * Focus-Hervorhebungen deaktivieren
   */
  function disableFocusHighlight() {
    const stylesheet = document.getElementById('a11y-focus-highlight-styles');
    if (stylesheet) {
      stylesheet.remove();
    }
  }
  
  /**
   * Seitenstruktur anzeigen (Übersicht, Skip-Links, etc.)
   */
  function showPageStructure() {
    // Seitenstruktur-Container erstellen
    const container = document.createElement('div');
    container.id = 'a11y-page-structure';
    container.setAttribute('role', 'navigation');
    container.setAttribute('aria-label', 'Seitenstruktur');
    
    // Styles für Container
    Object.assign(container.style, {
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: '999999',
      background: '#ffffff',
      border: '1px solid #cccccc',
      borderRadius: '5px',
      padding: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '300px',
      maxHeight: '80vh',
      overflow: 'auto',
      fontSize: '14px'
    });
    
    // HTML für Inhaltsverzeichnis erstellen
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h2 style="margin: 0; font-size: 16px;">Seitenstruktur</h2>
        <button id="a11y-close-structure" aria-label="Seitenstruktur schließen" style="background: none; border: none; cursor: pointer; padding: 5px;">✕</button>
      </div>
      <div style="display: flex; margin-bottom: 10px;">
        <button id="a11y-toc-button" aria-pressed="true" style="flex: 1; background: #0066cc; color: white; border: none; padding: 5px; margin-right: 5px; cursor: pointer; border-radius: 3px;">Inhaltsverzeichnis</button>
        <button id="a11y-landmarks-button" aria-pressed="false" style="flex: 1; background: #f0f0f0; color: #333; border: none; padding: 5px; cursor: pointer; border-radius: 3px;">Bereiche</button>
      </div>
      <div id="a11y-structure-content"></div>
    `;
    
    document.body.appendChild(container);
    
    // Button-Handler
    const closeButton = document.getElementById('a11y-close-structure');
    const tocButton = document.getElementById('a11y-toc-button');
    const landmarksButton = document.getElementById('a11y-landmarks-button');
    const contentArea = document.getElementById('a11y-structure-content');
    
    closeButton.addEventListener('click', hidePageStructure);
    
    tocButton.addEventListener('click', () => {
      tocButton.setAttribute('aria-pressed', 'true');
      tocButton.style.background = '#0066cc';
      tocButton.style.color = 'white';
      landmarksButton.setAttribute('aria-pressed', 'false');
      landmarksButton.style.background = '#f0f0f0';
      landmarksButton.style.color = '#333';
      buildTableOfContents(contentArea);
    });
    
    landmarksButton.addEventListener('click', () => {
      landmarksButton.setAttribute('aria-pressed', 'true');
      landmarksButton.style.background = '#0066cc';
      landmarksButton.style.color = 'white';
      tocButton.setAttribute('aria-pressed', 'false');
      tocButton.style.background = '#f0f0f0';
      tocButton.style.color = '#333';
      buildLandmarks(contentArea);
    });
    
    // Initial Inhaltsverzeichnis laden
    buildTableOfContents(contentArea);
  }
  
  /**
   * Inhaltsverzeichnis erstellen
   * @param {HTMLElement} container - Container für das Inhaltsverzeichnis
   */
  function buildTableOfContents(container) {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
      container.innerHTML = '<p style="color: #666;">Keine Überschriften gefunden.</p>';
      return;
    }
    
    let html = '<ul style="list-style: none; padding: 0; margin: 0;">';
    
    headings.forEach((heading, index) => {
      // ID hinzufügen, falls nicht vorhanden
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      
      const level = parseInt(heading.tagName.substring(1));
      const indent = (level - 1) * 15;
      
      html += `
        <li style="margin-bottom: 5px; padding-left: ${indent}px;">
          <a href="#${heading.id}" style="color: #0066cc; text-decoration: none; display: block; padding: 3px; border-radius: 3px;" 
            onmouseover="this.style.backgroundColor='#f0f0f0'" 
            onmouseout="this.style.backgroundColor='transparent'">
            ${heading.textContent}
          </a>
        </li>
      `;
    });
    
    html += '</ul>';
    container.innerHTML = html;
    
    // Event-Listener für Links
    const links = container.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          targetElement.focus();
          targetElement.style.outline = '3px solid #0066cc';
          setTimeout(() => {
            targetElement.style.outline = '';
          }, 2000);
        }
      });
    });
  }
  
  /**
   * Bereiche der Seite erstellen (Landmarks)
   * @param {HTMLElement} container - Container für die Landmarks
   */
  function buildLandmarks(container) {
    const landmarks = [
      { selector: 'header, [role="banner"]', label: 'Kopfbereich' },
      { selector: 'nav, [role="navigation"]', label: 'Navigation' },
      { selector: 'main, [role="main"]', label: 'Hauptinhalt' },
      { selector: 'aside, [role="complementary"]', label: 'Ergänzender Inhalt' },
      { selector: 'section, article', label: 'Abschnitt' },
      { selector: 'footer, [role="contentinfo"]', label: 'Fußbereich' },
      { selector: 'form, [role="form"]', label: 'Formular' },
      { selector: '[role="search"]', label: 'Suche' }
    ];
    
    let html = '<ul style="list-style: none; padding: 0; margin: 0;">';
    let foundAny = false;
    
    landmarks.forEach((landmark, index) => {
      const elements = document.querySelectorAll(landmark.selector);
      
      elements.forEach((element, elementIndex) => {
        foundAny = true;
        
        // ID hinzufügen, falls nicht vorhanden
        if (!element.id) {
          element.id = `landmark-${index}-${elementIndex}`;
        }
        
        // Titel extrahieren, falls vorhanden
        let title = '';
        if (element.hasAttribute('aria-label')) {
          title = element.getAttribute('aria-label');
        } else if (element.querySelector('h1, h2, h3, h4, h5, h6')) {
          title = element.querySelector('h1, h2, h3, h4, h5, h6').textContent;
        }
        
        html += `
          <li style="margin-bottom: 8px;">
            <a href="#${element.id}" style="color: #0066cc; text-decoration: none; display: block; padding: 5px; border-radius: 3px; background: #f5f5f5;" 
              onmouseover="this.style.backgroundColor='#e0e0e0'" 
              onmouseout="this.style.backgroundColor='#f5f5f5'">
              <strong>${landmark.label}</strong>
              ${title ? `<br><span style="font-size: 0.9em; color: #666;">${title}</span>` : ''}
            </a>
          </li>
        `;
      });
    });
    
    html += '</ul>';
    
    if (!foundAny) {
      container.innerHTML = '<p style="color: #666;">Keine Seitenbereiche (Landmarks) gefunden.</p>';
    } else {
      container.innerHTML = html;
      
      // Event-Listener für Links
      const links = container.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            targetElement.focus();
            
            // Visuelles Highlight
            const originalOutline = targetElement.style.outline;
            const originalBackground = targetElement.style.background;
            
            targetElement.style.outline = '3px solid #0066cc';
            targetElement.style.background = 'rgba(0, 102, 204, 0.1)';
            
            setTimeout(() => {
              targetElement.style.outline = originalOutline;
              targetElement.style.background = originalBackground;
            }, 2000);
          }
        });
      });
    }
  }
  
  /**
   * Seitenstruktur ausblenden
   */
  function hidePageStructure() {
    const container = document.getElementById('a11y-page-structure');
    if (container) {
      container.remove();
    }
  }
  
  // ====================================================================
  // Hilfsfunktionen für Leseunterstützung
  // ====================================================================
  
  /**
   * Lesemaske aktivieren
   */
  function enableReadingMask() {
    // Container für Lesemaske erstellen
    const maskContainer = document.createElement('div');
    maskContainer.id = 'a11y-reading-mask-container';
    
    // Styles für Container
    Object.assign(maskContainer.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '999997',
      pointerEvents: 'none'
    });
    
    // Obere Abdeckung
    const topMask = document.createElement('div');
    topMask.className = 'a11y-reading-mask a11y-reading-mask-top';
    Object.assign(topMask.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '50%',
      background: 'rgba(0, 0, 0, 0.5)',
      transition: 'height 0.2s ease'
    });
    
    // Untere Abdeckung
    const bottomMask = document.createElement('div');
    bottomMask.className = 'a11y-reading-mask a11y-reading-mask-bottom';
    Object.assign(bottomMask.style, {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '50%',
      background: 'rgba(0, 0, 0, 0.5)',
      transition: 'height 0.2s ease'
    });
    
    maskContainer.appendChild(topMask);
    maskContainer.appendChild(bottomMask);
    document.body.appendChild(maskContainer);
    
    // Event-Listener für Mausbewegung
    document.addEventListener('mousemove', updateReadingMask);
  }
  
  /**
   * Lesemaske aktualisieren
   * @param {MouseEvent} e - Maus-Event
   */
  function updateReadingMask(e) {
    const topMask = document.querySelector('.a11y-reading-mask-top');
    const bottomMask = document.querySelector('.a11y-reading-mask-bottom');
    
    if (!topMask || !bottomMask) return;
    
    const lineHeight = 50; // Höhe des sichtbaren Bereichs in Pixeln
    const mouseY = e.clientY;
    const windowHeight = window.innerHeight;
    
    // Berechnung der Maskenhöhen
    const topHeight = Math.max(0, mouseY - lineHeight / 2);
    const bottomHeight = Math.max(0, windowHeight - mouseY - lineHeight / 2);
    
    // Masken aktualisieren
    topMask.style.height = topHeight + 'px';
    bottomMask.style.height = bottomHeight + 'px';
  }
  
  /**
   * Lesemaske deaktivieren
   */
  function disableReadingMask() {
    const maskContainer = document.getElementById('a11y-reading-mask-container');
    if (maskContainer) {
      maskContainer.remove();
    }
    
    document.removeEventListener('mousemove', updateReadingMask);
  }
  
  /**
   * Lesehilfe aktivieren
   */
  function enableReadingGuide() {
    // Container für Lesehilfe erstellen
    const guideContainer = document.createElement('div');
    guideContainer.id = 'a11y-reading-guide';
    
    // Styles für Container
    Object.assign(guideContainer.style, {
      position: 'fixed',
      width: '100%',
      height: '30px',
      background: 'rgba(255, 255, 0, 0.2)',
      borderTop: '1px solid rgba(255, 200, 0, 0.5)',
      borderBottom: '1px solid rgba(255, 200, 0, 0.5)',
      zIndex: '999997',
      pointerEvents: 'none',
      transition: 'top 0.1s ease'
    });
    
    document.body.appendChild(guideContainer);
    
    // Event-Listener für Mausbewegung
    document.addEventListener('mousemove', updateReadingGuide);
  }
  
  /**
   * Lesehilfe aktualisieren
   * @param {MouseEvent} e - Maus-Event
   */
  function updateReadingGuide(e) {
    const guide = document.getElementById('a11y-reading-guide');
    
    if (!guide) return;
    
    const mouseY = e.clientY;
    const guideHeight = 30;
    
    // Position der Lesehilfe aktualisieren
    guide.style.top = (mouseY - guideHeight / 2) + 'px';
  }
  
  /**
   * Lesehilfe deaktivieren
   */
  function disableReadingGuide() {
    const guide = document.getElementById('a11y-reading-guide');
    if (guide) {
      guide.remove();
    }
    
    document.removeEventListener('mousemove', updateReadingGuide);
  }
  
  /**
   * Links hervorheben
   */
  function highlightLinks() {
    const css = `
      a {
        text-decoration: underline !important;
        color: #0000cc !important;
        font-weight: bold !important;
        background-color: rgba(0, 102, 204, 0.05) !important;
        border-bottom: 1px solid #0066cc !important;
        padding: 0 2px !important;
      }
      
      a:hover, a:focus {
        background-color: rgba(0, 102, 204, 0.1) !important;
        text-decoration: underline !important;
        outline: 2px solid #0066cc !important;
      }
    `;
    createAndAddStylesheet(css, 'a11y-highlight-links-styles');
  }
  
  /**
   * Links-Hervorhebung deaktivieren
   */
  function unhighlightLinks() {
    const stylesheet = document.getElementById('a11y-highlight-links-styles');
    if (stylesheet) {
      stylesheet.remove();
    }
  }
  
  /**
   * Überschriften hervorheben
   */
  function highlightHeadings() {
    const css = `
      h1, h2, h3, h4, h5, h6 {
        background-color: rgba(0, 102, 204, 0.05) !important;
        border-left: 5px solid #0066cc !important;
        padding: 5px 10px !important;
        margin: 15px 0 !important;
        font-weight: bold !important;
      }
      
      h1 { border-left-color: #0066cc !important; }
      h2 { border-left-color: #0088cc !important; }
      h3 { border-left-color: #00aacc !important; }
      h4 { border-left-color: #00cccc !important; }
      h5 { border-left-color: #00ccaa !important; }
      h6 { border-left-color: #00cc88 !important; }
    `;
    createAndAddStylesheet(css, 'a11y-highlight-headings-styles');
  }
  
  /**
   * Überschriften-Hervorhebung deaktivieren
   */
  function unhighlightHeadings() {
    const stylesheet = document.getElementById('a11y-highlight-headings-styles');
    if (stylesheet) {
      stylesheet.remove();
    }
  }
  
  // ====================================================================
  // Funktionen für Cursor-Anpassungen
  // ====================================================================
  
  /**
   * Benutzerdefinierten Cursor aktivieren
   * @param {string} size - Cursorgröße (big, bigger, biggest)
   * @param {string} color - Cursorfarbe (white, black, blue, red, green, yellow, purple)
   */
  function enableCustomCursor(size, color) {
    // Standardgröße festlegen
    let cursorSize = 16;
    
    // Größe basierend auf Parameter anpassen
    switch (size) {
      case 'big':
        cursorSize = 24;
        break;
      case 'bigger':
        cursorSize = 32;
        break;
      case 'biggest':
        cursorSize = 48;
        break;
      default:
        cursorSize = 16;
    }
    
    // Farbe festlegen
    let cursorColor = '#ffffff';
    switch (color) {
      case 'black':
        cursorColor = '#000000';
        break;
      case 'blue':
        cursorColor = '#0066cc';
        break;
      case 'red':
        cursorColor = '#cc0000';
        break;
      case 'green':
        cursorColor = '#00cc00';
        break;
      case 'yellow':
        cursorColor = '#ffcc00';
        break;
      case 'purple':
        cursorColor = '#cc00cc';
        break;
      default:
        cursorColor = '#ffffff';
    }
    
    // Container für benutzerdefinierten Cursor erstellen
    const cursorContainer = document.createElement('div');
    cursorContainer.id = 'a11y-custom-cursor';
    
    // Styles für Container
    Object.assign(cursorContainer.style, {
      position: 'fixed',
      width: cursorSize + 'px',
      height: cursorSize + 'px',
      borderRadius: '50%',
      border: `2px solid ${cursorColor}`,
      backgroundColor: color === 'white' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
      boxShadow: `0 0 10px ${cursorColor}`,
      zIndex: '999999',
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
      display: 'none'
    });
    
    document.body.appendChild(cursorContainer);
    
    // Event-Listener für Mausbewegung
    document.addEventListener('mousemove', handleMouseMove);
    
    // CSS für Cursor ausblenden
    const css = `
      * {
        cursor: none !important;
      }
    `;
    createAndAddStylesheet(css, 'a11y-custom-cursor-styles');
  }
  
  /**
   * Cursor-Position aktualisieren
   * @param {MouseEvent} e - Maus-Event
   */
  function handleMouseMove(e) {
    const cursor = document.getElementById('a11y-custom-cursor');
    
    if (!cursor) return;
    
    // Cursor anzeigen und positionieren
    cursor.style.display = 'block';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
  
  /**
   * Benutzerdefinierten Cursor deaktivieren
   */
  function disableCustomCursor() {
    // Cursor-Element entfernen
    const cursor = document.getElementById('a11y-custom-cursor');
    if (cursor) {
      cursor.remove();
    }
    
    // Stylesheet entfernen
    const stylesheet = document.getElementById('a11y-custom-cursor-styles');
    if (stylesheet) {
      stylesheet.remove();
    }
    
    // Event-Listener entfernen
    document.removeEventListener('mousemove', handleMouseMove);
  }
  
  // ====================================================================
  // Allgemeine Hilfsfunktionen
  // ====================================================================
  
  /**
   * Stylesheet erstellen und zum Dokument hinzufügen
   * @param {string} css - CSS-Inhalt
   * @param {string} id - ID für das Stylesheet-Element
   */
  function createAndAddStylesheet(css, id) {
    // Prüfen, ob Stylesheet bereits existiert
    const existingStylesheet = document.getElementById(id);
    if (existingStylesheet) {
      existingStylesheet.remove();
    }
    
    // Stylesheet erstellen
    const stylesheet = document.createElement('style');
    stylesheet.id = id;
    stylesheet.textContent = css;
    
    // Zum Dokument hinzufügen
    document.head.appendChild(stylesheet);
  }
  
  /**
   * Überprüfen, ob ein Element sichtbar ist
   * @param {HTMLElement} element - Zu überprüfendes Element
   * @returns {boolean} True, wenn Element sichtbar ist
   */
  function isElementVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           element.offsetWidth > 0 && 
           element.offsetHeight > 0;
  }
  
  /**
   * Alle Barrierefreiheits-Anpassungen anwenden
   * @param {Object} settings - Objekt mit Barrierefreiheits-Einstellungen
   */
  function applyAccessibilityStyles(settings) {
    // Alle bestehenden Styles entfernen
    removeAllAccessibilityStyles();
    
    let cssRules = '';
    
    // Kontrast-Modus anwenden
    if (settings.contrastMode !== 'default') {
      cssRules += getContrastModeStyles(settings.contrastMode);
    }
    
    // Schriftfamilie anwenden
    if (settings.fontFamily !== 'default') {
      cssRules += getFontFamilyStyles(settings.fontFamily);
    }
    
    // Text-Alignment anwenden
    if (settings.textAlign !== 'default') {
      cssRules += getTextAlignStyles(settings.textAlign);
    }
    
    // Textgröße anwenden
    if (settings.textSize > 0) {
      cssRules += getTextSizeStyles(settings.textSize);
    }
    
    // Zeilenabstand anwenden
    if (settings.lineHeight > 0) {
      cssRules += getLineHeightStyles(settings.lineHeight);
    }
    
    // Buchstabenabstand anwenden
    if (settings.letterSpacing > 0) {
      cssRules += getLetterSpacingStyles(settings.letterSpacing);
    }
    
    // Wortabstand anwenden
    if (settings.wordSpacing > 0) {
      cssRules += getWordSpacingStyles(settings.wordSpacing);
    }
    
    // Farbanpassungen anwenden
    if (settings.textColor !== 'default' || settings.titleColor !== 'default' || settings.backgroundColor !== 'default') {
      cssRules += getColorStyles({
        textColor: settings.textColor,
        titleColor: settings.titleColor,
        backgroundColor: settings.backgroundColor
      });
    }
    
    // Sättigung anwenden
    if (settings.saturation !== 100) {
      cssRules += `html { filter: saturate(${settings.saturation / 100}) !important; }`;
    }
    
    // Monochrome anwenden
    if (settings.monochrome > 0) {
      cssRules += `html { filter: grayscale(${settings.monochrome / 100}) !important; }`;
    }
    
    // Dark Mode anwenden
    if (settings.darkMode) {
      cssRules += `
        body { 
          background-color: #222222 !important;
          color: #ffffff !important;
        }
        p, div, span, li, td, th { 
          color: #ffffff !important;
        }
        a { color: #99ccff !important; }
        h1, h2, h3, h4, h5, h6 { color: #ffffff !important; }
      `;
    }
    
    // Bilder ausblenden
    if (settings.hideImages) {
      cssRules += `
        img, svg, figure, picture, video, canvas, .image {
          opacity: 0.1 !important;
          filter: grayscale(100%) !important;
        }
      `;
    }
    
    // Animationen stoppen
    if (settings.stopAnimations) {
      cssRules += `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
        }
      `;
    }
    
    // Stylesheet mit allen Regeln erstellen
    if (cssRules) {
      createAndAddStylesheet(cssRules, 'a11y-widget-main-styles');
    }
    
    // Navigationshilfen aktivieren/deaktivieren
    if (settings.keyboardNavigation) {
      enableKeyboardNavigation();
    } else {
      disableKeyboardNavigation();
    }
    
    if (settings.highlightFocus) {
      enableFocusHighlight();
    } else {
      disableFocusHighlight();
    }
    
    if (settings.pageStructure) {
      showPageStructure();
    } else {
      hidePageStructure();
    }
    
    if (settings.customCursor) {
      enableCustomCursor(settings.cursorSize, settings.cursorColor);
    } else {
      disableCustomCursor();
    }
    
    // Lesehilfen aktivieren/deaktivieren
    if (settings.readingMask) {
      enableReadingMask();
    } else {
      disableReadingMask();
    }
    
    if (settings.readingGuide) {
      enableReadingGuide();
    } else {
      disableReadingGuide();
    }
    
    if (settings.highlightLinks) {
      highlightLinks();
    } else {
      unhighlightLinks();
    }
    
    if (settings.highlightTitles) {
      highlightHeadings();
    } else {
      unhighlightHeadings();
    }
  }
  
  /**
   * Alle Barrierefreiheits-Anpassungen entfernen
   */
  function removeAllAccessibilityStyles() {
    // Liste der Stylesheet-IDs
    const stylesheetIds = [
      'a11y-widget-main-styles',
      'a11y-keyboard-navigation-styles',
      'a11y-focus-highlight-styles',
      'a11y-highlight-links-styles',
      'a11y-highlight-headings-styles',
      'a11y-custom-cursor-styles'
    ];
    
    // Alle Stylesheets entfernen
    stylesheetIds.forEach(id => {
      const stylesheet = document.getElementById(id);
      if (stylesheet) {
        stylesheet.remove();
      }
    });
    
    // Navigationshilfen deaktivieren
    disableKeyboardNavigation();
    disableFocusHighlight();
    hidePageStructure();
    disableCustomCursor();
    
    // Lesehilfen deaktivieren
    disableReadingMask();
    disableReadingGuide();
    unhighlightLinks();
    unhighlightHeadings();
  }
  
  // ====================================================================
  // Öffentliche API
  // ====================================================================
  
  // Funktionen exportieren
  Object.assign(window.A11yWidget.helpers, {
    // Style-Funktionen
    getContrastModeStyles,
    getFontFamilyStyles,
    getTextAlignStyles,
    getTextSizeStyles,
    getLineHeightStyles,
    getLetterSpacingStyles,
    getWordSpacingStyles,
    getColorStyles,
    
    // Navigationshilfen
    enableKeyboardNavigation,
    disableKeyboardNavigation,
    enableFocusHighlight,
    disableFocusHighlight,
    showPageStructure,
    hidePageStructure,
    enableCustomCursor,
    disableCustomCursor,
    
    // Lesehilfen
    enableReadingMask,
    disableReadingMask,
    enableReadingGuide,
    disableReadingGuide,
    highlightLinks,
    unhighlightLinks,
    highlightHeadings,
    unhighlightHeadings,
    
    // Allgemeine Funktionen
    createAndAddStylesheet,
    isElementVisible,
    applyAccessibilityStyles,
    removeAllAccessibilityStyles
  });
  
})(window, document);