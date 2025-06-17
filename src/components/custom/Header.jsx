import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { toast } from 'sonner';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '~/service/firebaseConfig';

export default function Header() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [openDialog, setOpenDialog] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState('');

  useEffect(() => {
    console.log('User:', user);
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: fetchProfile,
    onError: () => toast.error("Échec de l'authentification"),
    ux_mode: 'popup',
    scope: 'openid email profile',
  });

  async function fetchProfile({ access_token }) {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
      );
      localStorage.setItem('user', JSON.stringify(data));
      setOpenDialog(false);
      await setDoc(doc(db, 'consents', data.id), {
        email: data.email,
        consent: true,
        timestamp: new Date().toISOString(),
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Impossible de récupérer les informations");
    }
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo + Nom */}
        <a href="/" className="flex items-center space-x-3">
          <img src="/logo.svg" alt="Logo TripGenius" className="h-10 w-auto" />
          <span className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            TripGenius
          </span>
        </a>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-6 font-medium text-gray-700">
          <a href="/create-trip" className="hover:text-indigo-600 transition">
            Planifier
          </a>
          <a href="/my-trips" className="hover:text-indigo-600 transition">
            Mes voyages
          </a>
        </nav>

        {/* Connexion ou Avatar */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <img
                  src={user.picture}
                  alt="Profil"
                  className="h-10 w-10 rounded-full border-2 border-indigo-500 cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent align="end" className="p-2">
                <button
                  className="text-sm w-full text-left text-gray-700 hover:text-red-500"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Se déconnecter
                </button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
            >
              Se connecter
            </Button>
          )}
        </div>
      </div>

      {/* Dialog de Connexion */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-2xl text-gray-800">
              Connexion sécurisée
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Connectez-vous avec votre compte Google pour utiliser TripGenius.
            </DialogDescription>
          </DialogHeader>

          {/* Consentement RGPD */}
          <div className="mt-4 flex items-start gap-2">
            <input
              type="checkbox"
              id="rgpd"
              checked={consentChecked}
              onChange={(e) => {
                setConsentChecked(e.target.checked);
                setConsentError('');
              }}
              className="mt-1"
            />
            <label htmlFor="rgpd" className="text-sm text-gray-700">
              J'accepte l'utilisation de mes données personnelles conformément à la{' '}
              <a href="/confidentialite" target="_blank" className="underline text-indigo-600">
                politique de confidentialité
              </a>
              .
            </label>
          </div>

          {consentError && <p className="text-sm text-red-500 mt-1">{consentError}</p>}

          <Button
            onClick={() => {
              if (!consentChecked) {
                setConsentError("Veuillez accepter la politique de confidentialité.");
                return;
              }
              login();
            }}
            className="w-full mt-5 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white"
          >
            <FcGoogle className="h-6 w-6" />
            Continuer avec Google
          </Button>
        </DialogContent>
      </Dialog>
    </header>
  );
}
