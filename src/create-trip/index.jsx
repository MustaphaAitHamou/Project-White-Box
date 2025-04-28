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
} from "~/components/ui/dialog";

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false); // <-- setter corrigé

  // Pour debug
  useEffect(() => {
    console.log("FormData:", formData);
  }, [formData]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const OnGenerateTrip = async () => {
    console.log("OnGenerateTrip appelée");

    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true); // <-- ça existe maintenant
      return;
    }

    // Validation simplifiée
    if (
      !formData.location ||
      !formData.noOfDays ||
      !formData.budget ||
      !formData.traveler ||
      Number(formData.noOfDays) <= 0
    ) {
      toast("Veuillez rentrer toutes les informations");
      return;
    }

    // Prépare le prompt
    const locationText =
      formData.location.label || formData.location.description || "Unknown";
    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", locationText)
      .replace("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.traveler)
      .replace("{budget}", formData.budget)
      .replace("{totalDays}", formData.noOfDays);

    console.log("Prompt généré :", FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const text = await result.response.text();
      console.log("Réponse IA :", text);
    } catch (err) {
      console.error("Erreur IA:", err);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 px-5 mt-10">
      {/* Your form UI */}
      <div className="mt-20">
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
        <Input
          type="number"
          placeholder="Nombre de jours"
          onChange={e => handleInputChange("noOfDays", e.target.value)}
        />
        {/* … budget & traveler … */}
      </div>

      <div className="mt-10">
        <Button onClick={OnGenerateTrip}>Générer un voyage</Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connectez-vous</DialogTitle>
            <DialogDescription>
              Veuillez vous connecter pour lancer la génération du voyage.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
