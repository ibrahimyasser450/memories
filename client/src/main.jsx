import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";

import { AppProvider } from "./context/AppContext";
import App from "./App";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppProvider>
          <App />
          <ToastContainer />
        </AppProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
