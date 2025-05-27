
import React from "react";
import ReactDOM from "react-dom/client";
import { WidgetPanel } from "./components/accessibility/WidgetPanel";
import "@/styles/globals.css";

const App = () => {
  return <WidgetPanel isOpen={true} isEmbedded={true} />;
};

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
