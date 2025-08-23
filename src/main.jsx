/* eslint-env browser */
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import Header from "./components/custom/Header";
import CookieConsent from "./components/ui/CookiesConsent";
import App from "./App";
import CreateTrip from "./create-trip";
import ViewTrip from "./view-trip/[tripId]";
import MyTrips from "./my-trips";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import LegalMentions from "./components/pages/LegalMentions";
import CookieSettings from "./components/pages/CookieSettings";
import Sitemap from "./components/pages/Sitemap";
import "./index.css";
import Contact from "./components/pages/Contact";
/* ------------------------------------------------------------------ */
/*  Layout commun : Header + Outlet + Toaster                         */
/* ------------------------------------------------------------------ */
export function RootLayout() {
  return (
    <>
      <Header />
      <CookieConsent />
      <Outlet />
      <Toaster />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Définition des routes                                             */
/* ------------------------------------------------------------------ */
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/create-trip", element: <CreateTrip /> },
      { path: "/view-trip/:tripId", element: <ViewTrip /> },
      { path: "/my-trips", element: <MyTrips /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/legal-mentions", element: <LegalMentions /> },
      { path: "/cookie-settings", element: <CookieSettings /> },
      { path: "/sitemap", element: <Sitemap /> },
      { path: "/Contact", element: <Contact /> },
    ],
  },
]);

/* ------------------------------------------------------------------ */
/*  Render                                                            */
/* ------------------------------------------------------------------ */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
