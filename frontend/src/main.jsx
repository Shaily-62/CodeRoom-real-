import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import ThemeProvider from "./components/common/ThemeProvider.jsx";
import AuthInitializer from "./components/common/AuthInitializer.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </ThemeProvider>
  </StrictMode>
);