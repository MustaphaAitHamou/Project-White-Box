// src/create-trip/index.jsx

import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from "~/constants/options";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "~/service/AIModal";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});

  // Pour débug : log à chaque mise à jour du formulaire
  useEffect(() => {
    console.log("FormData:", formData);
  }, [formData]);

  // Vérifier la valeur de AI_PROMPT
  console.log("AI_PROMPT:", AI_PROMPT);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Setup Google OAuth (peut rester, on ne l'utilise plus par défaut)
  const login = useGoogleLogin({
    onSuccess: tokenInfo => {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
          { headers: { Authorization: `Bearer ${tokenInfo.access_token}` } }
        )
        .then(resp => {
          console.log("Profil Google:", resp.data);
          localStorage.setItem("user", JSON.stringify(resp.data));
          // Relance génération après login si besoin
          OnGenerateTrip();
        })
        .catch(err => console.error("Erreur récupération profil:", err));
    },
    onError: err => {
      console.error("Login Google erreur:", err);
      toast.error("Impossible de se connecter via Google");
    },
  });

  async function OnGenerateTrip() {
    console.log("OnGenerateTrip appelée");

    // --- En dev on bypass le check login ---
    // const user = localStorage.getItem("user");
    // if (!user) {
    //   login();
    //   return;
    // }

    // Validation basique
    if (
      !formData.location ||
      !formData.noOfDays ||
      !formData.budget ||
      !formData.traveler ||
      Number(formData.noOfDays) <= 0
    ) {
      toast.error("Veuillez remplir tous les champs correctement");
      return;
    }

    // Prépare la localisation
    const locationText =
      formData.location.label || formData.location.description || "Unknown";

    // Construit le prompt
    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", locationText)
      .replace("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.traveler)
      .replace("{budget}", formData.budget)
      .replace("{totalDays}", formData.noOfDays);

    console.log("Prompt généré:", FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const text = await result.response.text();
      console.log("Réponse IA:", text);
    } catch (err) {
      console.error("Erreur appel IA:", err);
      toast.error("Erreur lors de la génération du voyage");
    }
  }

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">Vos préférences de voyage</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Précisez quelques informations pour générer votre itinéraire
      </p>

      {/* Destination */}
      <div className="mt-8">
        <h3 className="text-xl font-medium">Destination</h3>
        <GooglePlacesAutocomplete
          apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
          selectProps={{
            value: place,
            onChange: v => {
              setPlace(v);
              handleInputChange("location", v);
            },
          }}
        />
      </div>

      {/* Nombre de jours */}
      <div className="mt-6">
        <h3 className="text-xl font-medium">Nombre de jours</h3>
        <Input
          type="number"
          placeholder="Ex. 3"
          onChange={e => handleInputChange("noOfDays", e.target.value)}
        />
      </div>

      {/* Budget */}
      <div className="mt-6">
        <h3 className="text-xl font-medium">Budget</h3>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {SelectBudgetOptions.map((opt, i) => (
            <div
              key={i}
              onClick={() => handleInputChange("budget", opt.title)}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${
                formData.budget === opt.title ? "shadow-lg border-black" : ""
              }`}
            >
              <div className="text-4xl">{opt.icon}</div>
              <div className="font-bold">{opt.title}</div>
              <div className="text-sm text-gray-500">{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nombre de voyageurs */}
      <div className="mt-6">
        <h3 className="text-xl font-medium">Voyageurs</h3>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {SelectTravelesList.map((opt, i) => (
            <div
              key={i}
              onClick={() => handleInputChange("traveler", opt.people)}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${
                formData.traveler === opt.people ? "shadow-lg border-black" : ""
              }`}
            >
              <div className="text-4xl">{opt.icon}</div>
              <div className="font-bold">{opt.title}</div>
              <div className="text-sm text-gray-500">{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton Générer */}
      <div className="mt-8 flex justify-end">
        <Button onClick={OnGenerateTrip}>Générer mon voyage</Button>
      </div>
    </div>
  );
}

export default CreateTrip;
