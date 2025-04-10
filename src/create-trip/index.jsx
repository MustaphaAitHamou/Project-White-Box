import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from "~/constants/options";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "~/service/AIModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log("Form Data mise à jour :", formData);
  }, [formData]);

  // Ajout d'un log pour vérifier AI_PROMPT dès le chargement
  console.log("Valeur de AI_PROMPT :", AI_PROMPT);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log("Erreur lors du login :", error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((resp) => {
        console.log("Profil Google :", resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        OnGenerateTrip();
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération du profil :", error)
      );
  };

  const OnGenerateTrip = async () => {
    console.log("OnGenerateTrip appelée");

    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    // Validation simplifiée : on vérifie que tous les champs nécessaires sont renseignés et que noOfDays > 0
    if (
      !formData?.noOfDays ||
      !formData?.location ||
      !formData?.budget ||
      !formData?.traveler ||
      Number(formData.noOfDays) <= 0
    ) {
      toast("Veuillez rentrer toutes les informations");
      return;
    }

    // Utilisation d'un fallback pour la localisation
    const locationText =
      formData.location.label || formData.location.description || "Unknown location";

    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", locationText)
      .replace("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.traveler)
      .replace("{budget}", formData.budget)
      .replace("{totalDays}", formData.noOfDays);

    console.log("Prompt généré :", FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      // Attendre la résolution de la promesse afin d'obtenir le texte complet
      const textResponse = await result?.response?.text();
      console.log("Réponse IA :", textResponse);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Quelles sont vos préférences de voyage ?
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Précisez-nous quelques informations
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            Quelle est votre destination ?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              value: place,
              onChange: (v) => {
                setPlace(v);
                console.log("Localisation sélectionnée :", v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Pour combien de jours ?
          </h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">Quel est votre budget ?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.budget === item.title ? "shadow-lg border-black" : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">À combien voyagez-vous ?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("traveler", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.traveler === item.people ? "shadow-lg border-black" : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button onClick={OnGenerateTrip}>Générer un voyage</Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connectez-vous avec Google</DialogTitle>
            <DialogDescription>
              Connectez-vous à l'application avec Google authentication de façon
              sécurisée
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <img src="/logo.svg" alt="Logo" />
            <Button
              onClick={login}
              className="w-full mt-5 flex gap-4 items-center"
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

export default CreateTrip;
