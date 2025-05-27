import { AccessibilityWidget } from '@/components/AccessibilityWidget';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { useEffect } from 'react';

export function WidgetEmbedPage() {
  useEffect(() => {
    // Message an Parent-Window senden wenn Widget geschlossen wird
    const handleWidgetClose = () => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'accessibility-widget-close' }, '*');
      }
    };

    // Event Listener für das Schließen des Widgets
    window.addEventListener('accessibility-widget-close', handleWidgetClose);

    return () => {
      window.removeEventListener('accessibility-widget-close', handleWidgetClose);
    };
  }, []);

  return (
    <AccessibilityProvider>
      <div className="widget-embed-container" style={{ 
        background: 'transparent',
        minHeight: '100vh',
        padding: 0,
        margin: 0
      }}>
        <AccessibilityWidget 
          isEmbedded={true}
          onClose={() => {
            // Custom Event dispatchen für iframe communication
            const event = new CustomEvent('accessibility-widget-close');
            window.dispatchEvent(event);
          }}
        />
      </div>
    </AccessibilityProvider>
  );
}
