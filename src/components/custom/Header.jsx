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
import ReCAPTCHA from 'react-google-recaptcha';

export default function Header() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [openDialog, setOpenDialog] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState(null);

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
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Impossible de récupérer les informations");
    }
  }

  return (
    <header className="bg-white shadow-md fixed top-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo et titre */}
        <a href="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-indigo-600">TripGenius</span>
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/create-trip" className="text-gray-700 hover:text-indigo-600 transition">
            Planifier un voyage
          </a>
          <a href="/my-trips" className="text-gray-700 hover:text-indigo-600 transition">
            Mes voyages
          </a>
        </nav>

        {/* Connexion utilisateur */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <img
                  src={user.picture}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent align="end" className="p-2">
                <button
                  className="w-full text-left text-gray-700 hover:text-red-500"
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
            <Button onClick={() => setOpenDialog(true)}>
              Se connecter
            </Button>
          )}
        </div>
      </div>

      {/* Dialog Connexion */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-3">
              <img src="/logo.svg" alt="Logo" className="h-12" />
              Connexion Google
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Authentifiez-vous en toute sécurité pour commencer votre aventure.
            </DialogDescription>
          </DialogHeader>

          {/* Consentement RGPD */}
          <div className="mt-4 flex items-start gap-2">
            <input
              type="checkbox"
              id="rgpd-consent"
              checked={consentChecked}
              onChange={(e) => {
                setConsentChecked(e.target.checked);
                setConsentError('');
              }}
              className="mt-1"
            />
            <label htmlFor="rgpd-consent" className="text-sm text-gray-700">
              J'accepte que mes données soient utilisées par TripGenius conformément à la politique de confidentialité.
            </label>
          </div>

          {consentError && (
            <p className="text-red-500 text-sm mt-2">{consentError}</p>
          )}

          {/* CAPTCHA */}
          <div className="mt-4">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(value) => setRecaptchaValue(value)}
            />
          </div>

          {/* Bouton de connexion explicite */}
          <Button
            className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white"
            onClick={() => {
              if (!consentChecked) {
                setConsentError("Vous devez accepter les conditions pour continuer.");
                return;
              }
              if (!recaptchaValue) {
                toast.error("Veuillez valider le reCAPTCHA.");
                return;
              }
              login();
            }}
          >
            <FcGoogle className="h-6 w-6" />
            Continuer avec Google
          </Button>
        </DialogContent>
      </Dialog>
    </header>
  );
}
