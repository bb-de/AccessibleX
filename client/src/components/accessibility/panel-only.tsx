import { WidgetPanel } from "@/components/accessibility/WidgetPanel";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

export default function PanelOnly() {
  return (
    <AccessibilityProvider>
      <div className="w-full h-full bg-transparent">
        <WidgetPanel isOpen={true} isEmbedded={true} />
      </div>
    </AccessibilityProvider>
  );
}
