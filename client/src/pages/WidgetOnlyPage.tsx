import React, { useEffect } from 'react';
import { AccessibilityWidget } from '@/components/accessibility/AccessibilityWidget';

export function WidgetOnlyPage() {
  useEffect(() => {
    // Send ready message to parent window if in iframe
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'WIDGET_READY' }, '*');
    }

    // Clean background for embedding
    document.body.style.backgroundColor = 'transparent';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    // Allow iframe interaction
    document.body.style.pointerEvents = 'auto';
  }, []);

  return (
    <div style={{ 
      width: '100vw',
      height: '100vh',
      backgroundColor: 'transparent',
      pointerEvents: 'auto'
    }}>
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 999999,
        pointerEvents: 'auto'
      }}>
        <AccessibilityWidget />
      </div>
    </div>
  );
}
