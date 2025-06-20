// src/create-trip/index.jsx

import React, { useState } from 'react';
import axios from 'axios';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import ReCAPTCHA from 'react-google-recaptcha';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '~/constants/options';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '~/service/AIModal';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '~/components/ui/dialog';
import { FcGoogle } from 'react-icons/fc';
import { X } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '~/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Footer from '~/view-trip/components/Footer';

export default function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Échec de l'authentification Google"),
    ux_mode: 'popup',
    scope: 'openid email profile',
  });

  async function handleGoogleSuccess({ access_token }) {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
      );
      localStorage.setItem('user', JSON.stringify(data));
      await setDoc(doc(db, 'consents', data.id), {
        email: data.email,
        consent: true,
        timestamp: new Date().toISOString(),
      });
      setOpenDialog(false);
      generateTrip();
    } catch (err) {
      console.error(err);
      toast.error('Impossible de récupérer le profil Google');
    }
  }

  async function generateTrip() {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (!formData.location || !formData.noOfDays || !formData.budget || !formData.traveler) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    const finalPrompt = AI_PROMPT
      .replace('{location}', formData.location.label)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget);

    try {
      const result = await chatSession.sendMessage(finalPrompt);
      const tripData = await result.response.text();
      const tripId = Date.now().toString();
      await setDoc(doc(db, 'AITrips', tripId), {
        userSelection: formData,
        TripData: JSON.parse(tripData),
        userEmail: JSON.parse(user).email,
        id: tripId,
      });
      navigate(`/view-trip/${tripId}`);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la génération du voyage');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500" />
        <section className="relative py-12 px-4 sm:px-10 md:px-32 lg:px-56 xl:px-72">
          <div className="max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800">Préférences de voyage</h2>
            <p className="mt-2 text-gray-600">Dites-nous où et comment vous souhaitez voyager.</p>

            {/* Destination */}
            <div className="mt-8">
              <label className="block text-lg font-medium text-gray-700">Destination</label>
              <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                selectProps={{
                  value: place,
                  onChange: v => {
                    setPlace(v);
                    handleInputChange('location', v);
                  },
                  className: 'mt-2 rounded-lg border-gray-300',
                }}
              />
            </div>

            {/* Nombre de jours */}
            <div className="mt-8">
              <label className="block text-lg font-medium text-gray-700">Nombre de jours</label>
              <Input
                type="number"
                placeholder="Ex. 5"
                className="mt-2 w-32 rounded-lg border-gray-300"
                onChange={e => handleInputChange('noOfDays', e.target.value)}
              />
            </div>

            {/* Budget */}
            <div className="mt-8">
              <label className="block text-lg font-medium text-gray-700">Budget</label>
              <div className="grid grid-cols-3 gap-4 mt-3">
                {SelectBudgetOptions.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => handleInputChange('budget', opt.title)}
                    className={`cursor-pointer p-4 rounded-lg transition-transform transform hover:-translate-y-1 ${
                      formData.budget === opt.title
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <p className="text-2xl mb-2">{opt.icon}</p>
                    <p className="font-semibold text-gray-800">{opt.title}</p>
                    <p className="text-sm text-gray-500">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Voyageurs */}
            <div className="mt-8">
              <label className="block text-lg font-medium text-gray-700">Nombre de voyageurs</label>
              <div className="grid grid-cols-3 gap-4 mt-3">
                {SelectTravelesList.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => handleInputChange('traveler', opt.people)}
                    className={`cursor-pointer p-4 rounded-lg transition-transform transform hover:-translate-y-1 ${
                      formData.traveler === opt.people
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <p className="text-2xl mb-2">{opt.icon}</p>
                    <p className="font-semibold text-gray-800">{opt.title}</p>
                    <p className="text-sm text-gray-500">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton Générer */}
            <div className="mt-10 flex justify-end">
              <Button
                onClick={generateTrip}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-3"
              >
                {loading
                  ? <AiOutlineLoading3Quarters className="animate-spin h-6 w-6" />
                  : 'Générer'
                }
              </Button>
            </div>
          </div>
        </section>

        {/* Popup RGPD + reCAPTCHA */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogOverlay />

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                Connexion Google
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Connectez-vous pour lancer la génération.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex items-start gap-2">
              <input
                id="rgpd-consent"
                type="checkbox"
                checked={consentChecked}
                onChange={e => {
                  setConsentChecked(e.target.checked);
                  setConsentError('');
                }}
                className="mt-1"
              />
              <label htmlFor="rgpd-consent" className="text-sm text-gray-700">
                J'accepte que mes données soient utilisées pour la création de voyages personnalisés par TripGenius conformément à la politique de confidentialité.
              </label>
            </div>
            {consentError && (
              <p className="text-red-500 text-sm mt-2">{consentError}</p>
            )}

            <div className="mt-4">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={setRecaptchaValue}
              />
            </div>

            <Button
              onClick={() => {
                if (!consentChecked) {
                  setConsentError("Vous devez accepter les conditions pour continuer.");
                  return;
                }
                if (!recaptchaValue) {
                  toast.error("Veuillez valider le reCAPTCHA");
                  return;
                }
                login();
              }}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white"
            >
              <FcGoogle className="h-6 w-6" />
              Continuer avec Google
            </Button>

            <DialogClose asChild>
              <button
                type="button"
                aria-label="Fermer"
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:shadow-md transition"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      {/* ← Ici on place le footer sous la page CreateTrip */}
      <Footer />
    </>
  );
}
