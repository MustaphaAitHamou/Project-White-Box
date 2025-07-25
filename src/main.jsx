  /* ------------------------------------------------------------------ */
  /*  src/main.jsx – point d’entrée                                     */
  /* ------------------------------------------------------------------ */

  /* eslint-env browser */
  
  import ReactDOM                   from 'react-dom/client';
  import './index.css';



  import {
    createBrowserRouter,
  } from 'react-router-dom';

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
        { path: '/',                 element: <App /> },
        { path: '/create-trip',      element: <CreateTrip /> },
        { path: '/view-trip/:tripId',element: <ViewTrip /> },
        { path: '/my-trips',         element: <MyTrips /> },
        { path: '/privacy-policy',   element: <PrivacyPolicy /> },
        { path: '/legal-mentions',   element: <LegalMentions /> },
        { path: '/cookie-settings',  element: <CookieSettings /> },
        { path: '/sitemap',          element: <Sitemap /> },
      ],
    },
  ]);

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </React.StrictMode>,
  );
