import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CreateTrip from './create-trip';
import Header from './components/custom/Header';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './view-trip/[tripId]/index.jsx';
import MyTrips from './my-trips';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import CookieConsent from './components/ui/CookiesConsent';
import LegalMentions from './components/pages/LegalMentions';
import Sitemap from './components/pages/Sitemap';
import CookieSettings from './components/pages/CookieSettings';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create-trip',
    element: <CreateTrip />,
  },
  {
    path: '/view-trip/:tripId',
    element: <Viewtrip />,
  },
  {
    path: '/my-trips',
    element: <MyTrips />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/legal-mentions',
    element: <LegalMentions />,
  },
  {
    path: '/cookie-settings',
    element: <CookieSettings />,
  },
  {
    path: '/sitemap',
    element: <Sitemap />,
  }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header />
      <CookieConsent /> 
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
