/* src/create-trip/index.jsx */
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';
import Footer from '~/view-trip/components/Footer.jsx';

const BUDGETS = [
  { key: 'cheap', icon: '🪙', label: 'Bon marché' },
  { key: 'medium', icon: '💸', label: 'Modéré' },
  { key: 'luxury', icon: '💰', label: 'Luxe' },
];

const TRAVELERS = [
  { key: 'solo', icon: '✈️', label: 'Seul' },
  { key: 'couple', icon: '🤜🏼🤛🏼', label: 'À deux' },
  { key: 'family', icon: '🏡', label: 'En famille' },
  { key: 'friends', icon: '🛥️', label: 'Entre amis' },
];

const useCurrentUser = () => ({ user: null });

export default function CreateTrip() {
  const { user } = useCurrentUser();

  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [budget, setBudget] = useState('');
  const [traveler, setTraveler] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [rgpdChecked, setRgpdChecked] = useState(false);

  const loginFn = useGoogleLogin({
    onSuccess: () => {
      toast.success('Connecté !');
      setShowLoginDialog(false);
    },
    onError: () => {
      toast.error('Erreur de connexion Google');
    },
  });

  const handleGenerate = () => {
    const missing =
      !destination.trim() ||
      !days ||
      !budget ||
      !traveler;

    if (missing) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    // génération du trip (user loggé)
  };

  const handleGoogleBtn = () => {
    if (!rgpdChecked) {
      toast.error('Merci d’accepter les conditions');
      return;
    }
    loginFn();
  };

  const budgetBtnClass = (b) =>
    `rounded-xl p-4 flex flex-col items-center gap-1 transition-all ${
      budget === b.key ? 'bg-gray-800 text-white shadow-lg' : 'bg-gray-100 text-gray-800'
    }`;

  const travelerBtnClass = (t) =>
    `rounded-xl p-4 flex flex-col items-center gap-1 transition-all ${
      traveler === t.key ? 'bg-gray-800 text-white shadow-lg' : 'bg-gray-100 text-gray-800'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <section className="py-16 px-6 md:px-20">
        <div className="mx-auto max-w-5xl bg-white/80 backdrop-blur-lg border border-white/30 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center">
            Crée ton voyage
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Colonne 1 */}
            <div className="space-y-8">
              <div>
                <Label htmlFor="destination-input" className="font-semibold text-gray-700">
                  Destination
                </Label>
                <Input
                  data-testid="gplaces"
                  placeholder="Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="days-input" className="font-semibold text-gray-700">
                  Nombre de jours
                </Label>
                <Input
                  id="days-input"
                  type="number"
                  min="1"
                  placeholder="Ex. 5"
                  className="w-32 mt-2"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="space-y-8">
              <div>
                <p className="font-semibold text-gray-700">Budget</p>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {BUDGETS.map((b) => (
                    <button
                      type="button"
                      key={b.key}
                      className={budgetBtnClass(b)}
                      onClick={() => setBudget(b.key)}
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <span className="text-xs font-medium">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Voyageurs</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {TRAVELERS.map((t) => (
                    <button
                      type="button"
                      key={t.key}
                      className={travelerBtnClass(t)}
                      onClick={() => setTraveler(t.key)}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-xs font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={handleGenerate}
              className="h-12 text-lg bg-gray-800 hover:bg-gray-700 text-white px-10 shadow-xl"
            >
              Générer
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="w-full max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Connexion Google
            </DialogTitle>
            <DialogDescription className="text-sm text-center text-gray-600">
              Connecte‑toi pour continuer.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex items-start gap-2">
            <input
              id="rgpd"
              type="checkbox"
              checked={rgpdChecked}
              onChange={(e) => setRgpdChecked(e.target.checked)}
            />
            <Label htmlFor="rgpd" className="text-sm text-gray-700">
              J’accepte l’utilisation de mes données.
            </Label>
          </div>

          <Button
            onClick={handleGoogleBtn}
            className="h-10 px-4 w-full mt-6 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white"
          >
            <span data-testid="google-icon" />
            Continuer avec Google
          </Button>

          <button
            aria-label="Fermer"
            type="button"
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
            onClick={() => setShowLoginDialog(false)}
          >
            <span data-testid="x-icon" />
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
