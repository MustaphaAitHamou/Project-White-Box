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

export default function Header() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Debug: afficher l'utilisateur
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
          <span className="text-xl font-bold text-indigo-600">TravelAI</span>
        </a>

        {/* Liens de navigation (caché sur mobile) */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/create-trip" className="text-gray-700 hover:text-indigo-600 transition">
            Planifier un voyage
          </a>
          <a href="/my-trips" className="text-gray-700 hover:text-indigo-600 transition">
            Mes voyages
          </a>
        </nav>

        {/* Actions utilisateur */}
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

      {/* Dialogue de connexion */}
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

          <div className="mt-6">
            <Button
              onClick={() => login()}
              className="w-full flex items-center justify-center gap-3"
            >
              <FcGoogle className="h-6 w-6" />
              Continuer avec Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
