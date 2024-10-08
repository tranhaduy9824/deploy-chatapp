import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <NotificationProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </NotificationProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>
);
