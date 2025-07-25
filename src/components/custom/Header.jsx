/* eslint-env browser */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

import { FcGoogle } from 'react-icons/fc';
import { X } from 'lucide-react';

// Helper: download any JS object as JSON file
function downloadJSON(obj, filename = 'tripgenius-data.json') {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Header() {
  // Load user from localStorage
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  // Sync across tabs
  useEffect(() => {
    const handler = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user')));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Login dialog state
  const [showLogin, setShowLogin] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');

  const recaptchaRef = useRef(null);

  // Google login hook
  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        // Fetch Google profile
        const { data } = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
        );
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setShowLogin(false);
        setError('');
      } catch {
        setError('Impossible de récupérer le profil Google.');
      }
    },
    onError: () => setError('Échec de l’authentification Google.'),
    scope: 'openid email profile',
    ux_mode: 'popup',
  });

  // Trigger login when consent given
  const handleContinue = () => {
    if (!agree) {
      setError('Vous devez accepter la collecte de données.');
      return;
    }
    setError('');
    login();
  };

  // Logout
  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    setUser(null);
  };

  // Download user data placeholder (trips must be fetched separately)
  const handleDownload = () => {
    const data = { user, trips: [] };
    downloadJSON(data);
  };

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-transparent">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-white">TripGenius</span>
        </a>

        {/* Nav links */}
        <nav className="space-x-8">
          <a href="/create-trip" className="text-gray-300 hover:text-white">
            Planifier
          </a>
          <a href="/my-trips" className="text-gray-300 hover:text-white">
            Mes voyages
          </a>
        </nav>

        {/* User / Connexion */}
        <div>
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <img
                  src={user.picture}
                  alt="avatar"
                  className="h-10 w-10 rounded-full ring-2 ring-indigo-500 cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-48 bg-white rounded-lg shadow-lg p-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-2 text-left"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-2 text-left"
                  onClick={handleDownload}
                >
                  Télécharger mes données
                </Button>
                <Button variant="destructive" size="sm" className="w-full text-left">
                  Supprimer mon compte
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              onClick={() => setShowLogin(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Connexion
            </Button>
          )}
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogOverlay />
        <DialogContent className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
          <DialogTitle className="text-center text-2xl font-bold mb-4">
            Connexion Google
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mb-6">
            Authentifiez‑vous pour commencer votre aventure.
          </DialogDescription>

          <div className="flex items-center mb-4">
            <input
              id="consent"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="consent" className="text-gray-700">
              J’accepte l’utilisation de mes données.
            </label>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <Button
            onClick={handleContinue}
            className="flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white mb-4"
          >
            <FcGoogle className="mr-2" /> Continuer avec Google
          </Button>

          <DialogClose asChild>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </header>
  );
}
