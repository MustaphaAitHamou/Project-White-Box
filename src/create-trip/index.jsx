import React, { useState, useEffect } from "react";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from "~/constants/options";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "~/service/AIModal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "~/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pour debug
  useEffect(() => {
    console.log("formData:", formData);
  }, [formData]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Configuration Google OAuth en popup + implicit flow ---
  const login = useGoogleLogin({
    onSuccess: getUserProfile,
    onError: err => console.error("OAuth Error:", err),
    flow: "implicit",
    ux_mode: "popup",
    scope: "openid email profile"
  });

  // Récupère le profil Google, stocke et relance la génération
  async function getUserProfile(tokenResponse) {
    try {
      const resp = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            Accept: "application/json"
          }
        }
      );
      localStorage.setItem("user", JSON.stringify(resp.data));
      setOpenDialog(false);
      // On relance la génération après s'être connecté
      OnGenerateTrip();
    } catch (err) {
      console.error("Error fetching user profile:", err);
      toast.error("Impossible de récupérer le profil Google");
    }
  }

  // --- Génération du voyage via Gemini ---
  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    // Validation simple du formulaire
    if (!formData.location || !formData.noOfDays || !formData.budget || !formData.traveler) {
      toast("Veuillez remplir toutes les informations");
      return;
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData.location.label)
      .replace("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.traveler)
      .replace("{budget}", formData.budget);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      SaveAiTrip(result.response.text());
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la génération du voyage");
      setLoading(false);
    }
  };

  // Enregistre le voyage généré dans Firestore puis redirige
  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      TripData: JSON.parse(TripData),
      userEmail: user.email,
      id: docId
    });
    setLoading(false);
    navigate("/view-trip/" + docId);
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      {/* Titre & description */}
      <h2 className="font-bold text-3xl">Quelles sont vos préférences de voyage ?</h2>
      <p className="mt-3 text-gray-500 text-xl">Précisez-nous quelques informations</p>

      {/* Destination */}
      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">Quelle est votre destination ?</h2>
        <GooglePlacesAutocomplete
          apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
          selectProps={{
            place,
            onChange: v => {
              setPlace(v);
              handleInputChange("location", v);
            }
          }}
        />
      </div>

      {/* Nombre de jours */}
      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">Pour combien de jours ?</h2>
        <Input
          placeholder="Ex. 3"
          type="number"
          onChange={e => handleInputChange("noOfDays", e.target.value)}
        />
      </div>

      {/* Budget */}
      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">Quel est votre budget ?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData.budget === item.title && "shadow-lg border-black"
              }`}
            >
              <div className="text-4xl">{item.icon}</div>
              <div className="font-bold text-lg">{item.title}</div>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nombre de voyageurs */}
      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">À combien voyagez-vous ?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleInputChange("traveler", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData.traveler === item.people && "shadow-lg border-black"
              }`}
            >
              <div className="text-4xl">{item.icon}</div>
              <div className="font-bold text-lg">{item.title}</div>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton Générer */}
      <div className="my-10 flex justify-end">
        <Button disabled={loading} onClick={OnGenerateTrip}>
          {loading
            ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
            : "Générer un voyage"}
        </Button>
      </div>

      {/* Dialog Google Login */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader className="text-center">
            <DialogTitle className="flex flex-col items-center gap-4">
              <img src="/logo.svg" alt="Logo" className="mx-auto" />
              Connectez-vous avec Google
            </DialogTitle>
            <DialogDescription>
              Connectez-vous de façon sécurisée à l’application avec Google Authentication.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button
              onClick={() => login()}
              className="w-full flex gap-4 justify-center items-center"
            >
              <FcGoogle className="h-7 w-7" />
              Connectez-vous avec Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
