/* eslint-env browser */
/* 
  Point d’entrée client : j’initialise le router, j’encapsule l’appli dans
  le provider OAuth Google et je rends le tout dans #root.
  Je garde un layout commun minimal (Header + CookieConsent + Outlet + Toaster).
*/
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
      {/* Je place le header site-wide */}
      <Header />
      {/* Je montre la bannière cookies tant que le consentement n’est pas stocké */}
      <CookieConsent />
      {/* Je laisse React Router injecter la vue courante ici */}
      <Outlet />
      {/* Toaster global pour les notifications (succès/erreur/info) */}
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
      // Je garde la casse telle quelle pour respecter le chemin attendu
      { path: "/Contact", element: <Contact /> },
    ],
  },
]);

/* ------------------------------------------------------------------ */
/*  Render                                                            */
/* ------------------------------------------------------------------ */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Je fournis l’ID client Google pour activer le flux OAuth (popup/redirect) */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      {/* Je branche le router sur l’arbre React */}
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
