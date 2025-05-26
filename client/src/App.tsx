import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { WidgetIntegrationPage } from "@/pages/WidgetIntegrationPage";
import { WidgetDocsPage } from "@/pages/WidgetDocsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/widget-integration" component={WidgetIntegrationPage} />
      <Route path="/widget-docs" component={WidgetDocsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </AccessibilityProvider>
  );
}

export default App;
