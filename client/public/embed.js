/**
 * Embeddable Accessibility Widget Script
 * This script can be included on any website to add the accessibility widget.
 */

(function() {
  // Configuration options that can be passed in from the script tag
  const DEFAULT_CONFIG = {
    position: 'bottom-right', // Options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    language: 'de',           // Default language
    color: '#0055A4',         // Primary color
    apiEndpoint: 'https://api.brandingbrothers.de/accessibility', // API endpoint for analytics and settings
    widgetLogo: '',           // Custom logo URL
    tokenId: ''               // Client identification token
  };

  // Get script tag and extract configuration
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  
  // Extract configuration from data attributes
  const config = { ...DEFAULT_CONFIG };
  for (const key in DEFAULT_CONFIG) {
    if (currentScript.dataset[key]) {
  config[key] = currentScript.dataset[key];
}
      (config as any)[key] = currentScript.dataset[key as keyof typeof DEFAULT_CONFIG];
    }
  }

  // Function to load CSS
  function loadStyles() {
    const styleTag = document.createElement('style');
    styleTag.textContent = 
      '#accessibility-widget-container * {' +
      '  box-sizing: border-box;' +
      '  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;' +
      '}' +
      
      '#accessibility-widget-button {' +
      '  position: fixed;' +
      '  z-index: 9998;' +
      '  width: 48px;' +
      '  height: 48px;' +
      '  border-radius: 50%;' +
      '  background-color: ' + config.color + ';' +
      '  color: white;' +
      '  border: none;' +
      '  display: flex;' +
      '  align-items: center;' +
      '  justify-content: center;' +
      '  cursor: pointer;' +
      '  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);' +
      '  transition: all 0.3s ease;' +
      '}' +
      
      '#accessibility-widget-button:hover {' +
      '  transform: scale(1.1);' +
      '  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);' +
      '}' +
      
      '#accessibility-widget-button svg {' +
      '  width: 28px;' +
      '  height: 28px;' +
      '}' +
      
      '/* Position Variants */' +
      '#accessibility-widget-button.bottom-right {' +
      '  bottom: 20px;' +
      '  right: 20px;' +
      '}' +
      
      '#accessibility-widget-button.bottom-left {' +
      '  bottom: 20px;' +
      '  left: 20px;' +
      '}' +
      
      '#accessibility-widget-button.top-right {' +
      '  top: 20px;' +
      '  right: 20px;' +
      '}' +
      
      '#accessibility-widget-button.top-left {' +
      '  top: 20px;' +
      '  left: 20px;' +
      '}' +
      
      '/* Widget panel styles will be loaded from the iframe */';
    document.head.appendChild(styleTag);
  }

  // Widget button HTML with SVG icon
  function createWidgetButton() {
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    
    const button = document.createElement('button');
    button.id = 'accessibility-widget-button';
    button.className = config.position;
    button.setAttribute('aria-label', 'Open accessibility menu');
    button.setAttribute('type', 'button');
    
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v4M12 16h.01"></path>
      </svg>
    `;
    
    container.appendChild(button);
    document.body.appendChild(container);
    
    return button;
  }

  // Create iframe to load the widget panel
  function createWidgetIframe() {
    const iframe = document.createElement('iframe');
    iframe.id = 'accessibility-widget-iframe';
    iframe.style.position = 'fixed';
    iframe.style.zIndex = '9999';
    iframe.style.border = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.transition = 'opacity 0.3s ease';
    
    // Position the iframe based on configuration
    switch(config.position) {
      case 'bottom-right':
        iframe.style.bottom = '80px';
        iframe.style.right = '20px';
        break;
      case 'bottom-left':
        iframe.style.bottom = '80px';
        iframe.style.left = '20px';
        break;
      case 'top-right':
        iframe.style.top = '80px';
        iframe.style.right = '20px';
        break;
      case 'top-left':
        iframe.style.top = '80px';
        iframe.style.left = '20px';
        break;
    }
    
    document.body.appendChild(iframe);
    return iframe;
  }

  // Apply accessibility styles to the host page
  function applyAccessibilityStyles(settings: any) {
    resetAccessibilityStyles();
    
    const styleTag = document.createElement('style');
    styleTag.id = 'accessibility-styles';
    
    let css = '';
    
    // Text size adjustments
    if (settings.textSize !== 0) {
      const textSizePercent = 100 + (settings.textSize * 10);
      css += `
        body, p, div, span, a, li, input, button, textarea, select, label {
          font-size: ${textSizePercent}% !important;
        }
      `;
    }
    
    // Line height adjustments
    if (settings.lineHeight !== 0) {
      const lineHeightValue = 1.5 + (settings.lineHeight * 0.1);
      css += `
        p, div, span, li {
          line-height: ${lineHeightValue} !important;
        }
      `;
    }
    
    // Letter spacing
    if (settings.letterSpacing !== 0) {
      const letterSpacingValue = settings.letterSpacing * 0.5;
      css += `
        body, p, div, span, a, li, input, button, textarea, select, label {
          letter-spacing: ${letterSpacingValue}px !important;
        }
      `;
    }
    
    // Dark mode
    if (settings.darkMode) {
      css += `
        html, body {
          background-color: #121212 !important;
          filter: invert(1) hue-rotate(180deg) !important;
        }
        
        img, video, picture, svg, canvas, [style*="background-image"] {
          filter: invert(1) hue-rotate(180deg) !important;
        }
      `;
    }
    
    // Font family
    if (settings.fontFamily !== 'default') {
      let fontFamilyValue = '';
      switch (settings.fontFamily) {
        case 'readable':
          fontFamilyValue = 'Arial, sans-serif';
          break;
        case 'dyslexic':
          fontFamilyValue = 'OpenDyslexic, Comic Sans MS, sans-serif';
          if (!document.getElementById('accessibility-font-dyslexic')) {
            const fontLink = document.createElement('link');
            fontLink.id = 'accessibility-font-dyslexic';
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.css';
            document.head.appendChild(fontLink);
          }
          break;
      }
      
      if (fontFamilyValue) {
        css += `
          body, p, div, span, a, li, input, button, textarea, select, label {
            font-family: ${fontFamilyValue} !important;
          }
        `;
      }
    }
    
    // Text alignment
    if (settings.textAlign !== 'default') {
      css += `
        p, div, h1, h2, h3, h4, h5, h6 {
          text-align: ${settings.textAlign} !important;
        }
      `;
    }
    
    // High contrast
    if (settings.contrastMode === 'high') {
      css += `
        body, p, div, span, a, li, input, button, textarea, select, label {
          color: white !important;
          background-color: black !important;
        }
        
        a, button {
          color: yellow !important;
          text-decoration: underline !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: white !important;
          background-color: black !important;
        }
      `;
    }
    
    // Weitere Features...
    
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
    
    if (settings.keyboardNavigation) {
      enableKeyboardNavigation();
    }
  }
  
  // Reset all applied accessibility styles
  function resetAccessibilityStyles() {
    const existingStyles = document.getElementById('accessibility-styles');
    if (existingStyles) {
      existingStyles.remove();
    }
    // ... weitere Reset-Logik
  }
  
  // Initialize the widget
  function initWidget() {
    loadStyles();
    
    const button = createWidgetButton();
    const iframe = createWidgetIframe();
    
    const iframeSrc = new URL(config.apiEndpoint + '/widget-embed');
    Object.keys(config).forEach(key => {
      iframeSrc.searchParams.append(key, String(config[key as keyof typeof config]));
    });
    iframe.src = iframeSrc.toString();
    
    let isOpen = false;
    
    function toggleWidget() {
      isOpen = !isOpen;
      
      if (isOpen) {
        iframe.style.width = '340px';
        iframe.style.height = '500px';
        iframe.style.opacity = '1';
        iframe.style.pointerEvents = 'auto';
        button.setAttribute('aria-expanded', 'true');
      } else {
        iframe.style.opacity = '0';
        setTimeout(() => {
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.pointerEvents = 'none';
        }, 300);
        button.setAttribute('aria-expanded', 'false');
      }
      
      iframe.contentWindow?.postMessage({
        type: 'accessibility-widget-toggle',
        isOpen
      }, '*');
    }
    
    button.addEventListener('click', toggleWidget);
    
    // Message listener für Widget-Kommunikation
    window.addEventListener('message', (event) => {
      if (event.source !== iframe.contentWindow) {
        return;
      }
      
      const { type, data } = event.data;
      
      switch (type) {
        case 'accessibility-widget-ready':
          console.log('Accessibility widget ready');
          break;
          
        case 'accessibility-widget-close':
          if (isOpen) {
            toggleWidget();
          }
          break;
          
        case 'accessibility-widget-profile-applied':
          applyAccessibilityStyles(data.profileSettings);
          break;
          
        case 'accessibility-widget-reset':
          resetAccessibilityStyles();
          break;
          
        case 'accessibility-widget-setting-changed':
          updateAccessibilitySetting(data.setting, data.value);
          break;
      }
    });
  }

  // Initialize when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
