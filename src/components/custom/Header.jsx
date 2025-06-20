// src/components/custom/Header.jsx

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { FaSignOutAlt, FaFileDownload, FaTrashAlt } from 'react-icons/fa';
import { db } from '@/service/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc as docRef,
} from 'firebase/firestore';

export default function Header() {
  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;

  const [showLogin, setShowLogin] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');

  const login = useGoogleLogin({
    onSuccess: handleProfile,
    onError: () => toast.error('Échec de l’authentification'),
    ux_mode: 'popup',
    scope: 'openid email profile',
  });

  async function handleProfile({ access_token }) {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
      );
      localStorage.setItem('user', JSON.stringify(res.data));
      setShowLogin(false);
      window.location.reload();
    } catch {
      toast.error('Impossible de récupérer les infos');
    }
  }

  const logout = () => {
    googleLogout();
    localStorage.removeItem('user');
    window.location.reload();
  };

  const deleteAccount = async () => {
    if (!user) return;
    if (confirmEmail !== user.email) {
      toast.error('Adresse e-mail de confirmation incorrecte.');
      return;
    }
    try {
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email));
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map((d) => deleteDoc(docRef(db, 'AITrips', d.id))));
      await deleteDoc(docRef(db, 'consents', user.id));

      localStorage.removeItem('user');
      googleLogout();
      toast.success('Compte supprimé.');
      window.location.reload();
    } catch (err) {
      toast.error('Erreur suppression : ' + err.message);
    }
  };

  return (
    <>
      <header className="bg-transparent backdrop-blur-md shadow fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Logo" className="h-8" />
            {/* Texte TripGenius en blanc */}
            <span className="text-xl font-bold text-white">TripGenius</span>
          </a>

          <nav className="hidden md:flex space-x-6">
            <a
              href="/create-trip"
              className="text-white hover:text-indigo-200 transition"
            >
              Planifier
            </a>
            {user && (
              <a
                href="/my-trips"
                className="text-white hover:text-indigo-200 transition"
              >
                Mes voyages
              </a>
            )}
          </nav>

          <div>
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <img
                    src={user.picture}
                    alt="avatar"
                    className="h-10 w-10 rounded-full cursor-pointer ring-2 ring-indigo-400"
                  />
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="p-2 bg-transparent backdrop-blur-md rounded-lg shadow-lg w-56 space-y-2"
                >
                  <Button
                    onClick={logout}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-4 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    <FaSignOutAlt className="mr-2" /> Se déconnecter
                  </Button>
                  <Button
                    onClick={() => {}}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-4 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    <FaFileDownload className="mr-2" /> Télécharger mes données
                  </Button>
                  <Button
                    onClick={() => setShowDelete(true)}
                    variant="solid"
                    size="sm"
                    className="w-full justify-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    <FaTrashAlt className="mr-2" /> Supprimer mon compte
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                onClick={() => setShowLogin(true)}
                variant="gradient"
                size="md"
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Dialogs… */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogOverlay />
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

          <div className="mt-4 flex items-start gap-2">
            <input
              id="rgpd-consent"
              type="checkbox"
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
                setError('');
              }}
              className="mt-1"
            />
            <label htmlFor="rgpd-consent" className="text-sm text-gray-700">
              J'accepte que mes données soient utilisées par TripGenius conformément
              à la politique de confidentialité.
            </label>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <Button
            className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
            onClick={login}
          >
            <FcGoogle className="h-6 w-6" /> Continuer avec Google
          </Button>

          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer"
              className="absolute top-4 right-4 p-2 bg-transparent rounded-full hover:bg-gray-200 transition"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogOverlay />
        <DialogContent className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg relative">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-red-600">
              Suppression du compte
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mb-4">
              Veuillez saisir votre email pour confirmer.
            </DialogDescription>
          </DialogHeader>

          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="votre.email@exemple.com"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 mb-6"
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="md" onClick={() => setShowDelete(false)}>
              Annuler
            </Button>
            <Button variant="destructive" size="md" onClick={deleteAccount}>
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
