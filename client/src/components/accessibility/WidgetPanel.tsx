import { useState, useEffect } from "react";
import { ProfilesTab } from "./ProfilesTab";
import { VisionTab } from "./VisionTab";
import { ContentTab } from "./ContentTab";
import { NavigationTab } from "./NavigationTab";
import { WidgetFooter } from "./WidgetFooter";
import { LanguageSelector } from "./LanguageSelector";
import { AccessibleLogoInline } from "./AccessibleLogoInline";
import { useAccessibility } from "@/hooks/useAccessibility";
import {
  UserCog,
  Eye,
  FileText,
  Compass,
  RotateCcw,
  X,
} from "lucide-react";

interface WidgetPanelProps {
  isOpen: boolean;
  isEmbedded?: boolean;
  onClose?: () => void;
}

type TabType = "profiles" | "vision" | "content" | "navigation";

export function WidgetPanel({
  isOpen,
  isEmbedded = false,
  onClose,
}: WidgetPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profiles");
  const { toggleWidget, resetSettings, translations } = useAccessibility();

  // 🔁 REAGIERT auf CustomEvent von embed.js
  useEffect(() => {
    const handler = () => {
      toggleWidget(true); // zeigt das Panel
    };
    window.addEventListener("AccessibleXForceOpen", handler);
    return () => window.removeEventListener("AccessibleXForceOpen", handler);
  }, [toggleWidget]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div
      id="accessibility-panel"
      className={`fixed right-4 bg-white rounded-xl shadow-lg transition-all duration-300 transform z-[9999] ${
        isOpen
          ? "translate-y-0 opacity-100 visible"
          : "translate-y-[-100%] opacity-0 invisible"
      }`}
      style={{
        width: "340px",
        minWidth: "340px",
        maxWidth: "340px",
        maxHeight: "90vh",
        overflowY: "scroll",
        scrollBehavior: "smooth",
        bottom: "90px",
      }}
      aria-hidden={!isOpen}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AccessibleLogoInline className="mr-2" />
          </div>
          <div className="flex space-x-2">
            <button
              id="reset-btn"
              aria-label={translations.resetAllSettings}
              className="text-sm text-gray-500 hover:text-gray-700 p-1 rounded flex items-center"
              onClick={resetSettings}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {translations.reset}
            </button>
            <button
              id="close-panel-btn"
              aria-label={translations.closeAccessibilityMenu}
              className="text-gray-500 hover:text-gray-700 p-1 rounded flex items-center"
              onClick={() => {
                if (isEmbedded && onClose) {
                  onClose();
                } else {
                  toggleWidget();
                }
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mt-3 flex justify-end">
          <LanguageSelector />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-lg overflow-x-auto">
        {[
          { key: "profiles", icon: UserCog, label: translations.profiles },
          { key: "vision", icon: Eye, label: translations.vision },
          { key: "content", icon: FileText, label: translations.content },
          { key: "navigation", icon: Compass, label: translations.navigation },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-3 px-2 text-sm font-medium ${
              activeTab === tab.key
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange(tab.key as TabType)}
            aria-selected={activeTab === tab.key}
          >
            <div className="flex flex-col items-center">
              <tab.icon className="h-5 w-5 mb-1" />
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="overflow-y-visible">
        {activeTab === "profiles" && <ProfilesTab />}
        {activeTab === "vision" && <VisionTab />}
        {activeTab === "content" && <ContentTab />}
        {activeTab === "navigation" && <NavigationTab />}
      </div>

      {/* Panel Footer */}
      <WidgetFooter />
    </div>
  );
}

function AccessibilityIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
