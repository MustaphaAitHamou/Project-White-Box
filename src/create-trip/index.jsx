/* ------------------------------------------------------------------
   src/create-trip/index.jsx
------------------------------------------------------------------- */
import React, { useState } from "react";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from "~/constants/options";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { getEnv } from "~/lib/meta-env";
import { generateTripPlan } from "~/service/AIModal";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "~/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "~/service/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Footer from "~/view-trip/components/Footer";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function CreateTrip() {
  // État principal du formulaire :
  // - place : valeur retournée par Google Places
  // - formData : je stocke location, noOfDays, budget, traveler
  // - openDialog : j’affiche la modale d’auth quand il n’y a pas d’utilisateur
  // - loading : j’empêche les doubles soumissions pendant la génération
  // - consentChecked / consentError : gestion du consentement dans la modale
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");

  // Je lis la clé via un helper compatible Vite + Jest (fallback test-friendly).
  const PLACE_API_KEY = getEnv("VITE_GOOGLE_PLACE_API_KEY");

  // Navigation programmatique vers la page du trip
  const navigate = useNavigate();

  // Petit utilitaire pour mettre à jour les champs du formulaire
  const update = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  // Flux de connexion Google :
  // - onSuccess : je récupère le profil, je persiste l’utilisateur, j’enregistre le consentement en base
  // - onError : je notifie l’échec
  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const { data } = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
        );
        localStorage.setItem("user", JSON.stringify(data));
        window.dispatchEvent(new Event("userChanged"));

        // Je trace le consentement côté Firestore
        await setDoc(doc(db, "consents", data.id), {
          email: data.email,
          consent: true,
          timestamp: new Date().toISOString(),
        });

        setOpenDialog(false);
        // J’enchaîne sur la génération après authentification
        generateTrip();
      } catch {
        toast.error("Impossible de récupérer le profil Google");
      }
    },
    onError: () => toast.error("Échec de l'authentification Google"),
    ux_mode: "popup",
    scope: "openid email profile",
  });

  // Routine de génération :
  // 1) je force l’auth si aucun user
  // 2) je valide les champs requis
  // 3) je construis le prompt et j’appelle le service IA
  // 4) j’enregistre le résultat dans Firestore et je redirige
  async function generateTrip() {
    setLoading(true);

    if (!localStorage.getItem("user")) {
      setOpenDialog(true);
      return;
    }

    const { location, noOfDays, budget, traveler } = formData;
    if (!location || !noOfDays || !budget || !traveler) {
      toast.error("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    // Construction du prompt strict à partir des placeholders
    const prompt = AI_PROMPT.replace("{location}", location.label)
      .replace(/{totalDays}/g, noOfDays)
      .replace("{traveler}", traveler)
      .replace("{budget}", budget);

    try {
      // Appel au service IA (réponse structurée attendue)
      const res = await generateTripPlan(prompt);

      // Je crée un id simple basé sur l’horodatage (suffisant pour ce contexte)
      const id = Date.now().toString();
      await setDoc(doc(db, "AITrips", id), {
        userSelection: formData,
        TripData: res,
        userEmail: JSON.parse(localStorage.getItem("user")).email,
        id,
      });

      // Redirection vers la vue du trip généré
      navigate(`/view-trip/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Conteneur global avec fond en dégradé discret */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <section className="py-16 px-6 md:px-20">
          {/* Carte principale translucide : meilleure lisibilité sur le fond */}
          <div className="mx-auto max-w-5xl bg-white/80 backdrop-blur-lg border border-white/30 rounded-3xl p-10 shadow-2xl">
            <h2 className="text-3xl font-extrabold text-gray-800 text-center">
              Crée ton voyage
            </h2>

            {/* ----------- Formulaire ----------- */}
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {/* Colonne gauche : destination + nombre de jours */}
              <div className="space-y-8">
                {/* Destination : composant contrôlé via selectProps */}
                <div>
                  <label
                    htmlFor="destination"
                    className="font-semibold text-gray-700"
                  >
                    Destination
                  </label>
                  <GooglePlacesAutocomplete
                    apiKey={PLACE_API_KEY}
                    selectProps={{
                      inputId: "destination",
                      value: place,
                      onChange: (v) => {
                        setPlace(v);
                        update("location", v);
                      },
                      className: "mt-2 rounded-lg border-gray-300",
                    }}
                  />
                </div>

                {/* Nombre de jours : champ numérique minimaliste */}
                <div>
                  <label htmlFor="days" className="font-semibold text-gray-700">
                    Nombre de jours
                  </label>
                  <Input
                    id="days"
                    type="number"
                    min={1}
                    placeholder="Ex. 5"
                    className="w-32 mt-2"
                    onChange={(e) => update("noOfDays", e.target.value)}
                  />
                </div>
              </div>

              {/* Colonne droite : budget + voyageurs */}
              <div className="space-y-8">
                {/* Budget : je stocke seulement le titre pour le prompt */}
                <div>
                  <p className="font-semibold text-gray-700">Budget</p>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {SelectBudgetOptions.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => update("budget", b.title)}
                        className={`rounded-xl p-4 flex flex-col items-center gap-1 transition-all ${
                          formData.budget === b.title
                            ? "bg-gray-800 text-white shadow-lg"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <span className="text-2xl">{b.icon}</span>
                        <span className="text-xs font-medium">{b.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voyageurs : même logique, je stocke la valeur people */}
                <div>
                  <p className="font-semibold text-gray-700">Voyageurs</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                    {SelectTravelesList.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => update("traveler", t.people)}
                        className={`rounded-xl p-4 flex flex-col items-center gap-1 transition-all ${
                          formData.traveler === t.people
                            ? "bg-gray-800 text-white shadow-lg"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <span className="text-2xl">{t.icon}</span>
                        <span className="text-xs font-medium">{t.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton d’action principal : je désactive pendant la génération */}
            <div className="mt-12 text-center">
              <Button
                onClick={generateTrip}
                disabled={loading}
                size="lg"
                className="bg-gray-800 hover:bg-gray-700 text-white px-10 shadow-xl"
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    <span className="sr-only" aria-live="polite">
                      Veuillez patienter…
                    </span>
                    Création en cours
                  </>
                ) : (
                  "Générer"
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* ---------- Dialog Connexion Google ---------- */}
        {/* Je demande un consentement explicite avant de déclencher le flux OAuth. */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex flex-col items-center gap-3">
                <img src="/logo.svg" alt="Logo" className="h-12" />
                Connexion Google
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Authentifiez-vous pour commencer votre aventure.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex items-start gap-2">
              <input
                id="rgpd"
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => {
                  setConsentChecked(e.target.checked);
                  setConsentError("");
                }}
                className="mt-1"
              />
              <label htmlFor="rgpd" className="text-sm text-gray-700">
                J’accepte l’utilisation de mes données par TripGenius.{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  En savoir plus
                </a>
              </label>
            </div>

            {consentError && (
              <p className="text-red-500 text-sm mt-2">{consentError}</p>
            )}

            <Button
              onClick={() => {
                // Je refuse de lancer l’auth tant que le consentement n’est pas coché
                if (!consentChecked) {
                  setConsentError("Merci d’accepter les conditions");
                  return;
                }
                login(); // 🟢 lance l’authent Google puis la génération
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white"
            >
              <FcGoogle className="h-6 w-6" />
              Continuer avec Google
            </Button>

            <DialogClose asChild>
              <button
                type="button"
                aria-label="Fermer"
                className="absolute top-4 right-4 rounded-full bg-white p-2 shadow"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      {/* Footer global */}
      <Footer />
    </>
  );
}
