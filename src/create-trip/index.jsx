import React, { useState, useEffect } from "react";
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
  DialogTrigger
} from "~/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "~/service/firebaseConfig";

function CreateTrip() {
  const [place, setPlace] = useState();

  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login=useGoogleLogin({
    onSuccess: (codeResp)=>console.log(codeResp),
    onError: (error)=>console.log(error)
  })

  const OnGenerateTrip=async()=>{

    const user = localStorage.getItem('user');

    if(!user)
    {
      setOpenDialog(true)
      return;
    }

    if(formData?.noOfDays>5&&formData?.location||!formData?.budget||!formData?.traveler)
    {
        toast("Veuillez rentrer toutes les informations")
        return;
    }
    setLoading(true);
    const FINAL_PROMPT=AI_PROMPT
    .replace('{location}', formData?.location?.label)
    .replace('{totalDays}', formData?.noOfDays)
    .replace('{traveler}', formData?.traveler)
    .replace('{budget}', formData?.budget)
    .replace('{totalDays}', formData?.noOfDays)

    const result=await chatSession.sendMessage(FINAL_PROMPT);

    console.log("--", result?.response?.text());
    setLoading(false)
    SaveAiTrip(result?.response?.text())
  }

  const SaveAiTrip=async(TripData)=>{

  setLoading(true);
    const user=JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString()
    await setDoc(doc(db, "AITrips", docId), {
      userSelection:formData,
      TripData:JSON.parse(TripData),
      userEmail:user?.email,
      id:docId
    });
    setLoading(false);
  }

  const getUserProfile = (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "Application/json",
        },
      })
      .then((resp) => {
        console.log("User Profile:", resp);
        localStorage.setItem('user', JSON.stringify(resp.data));
        setOpenDialog(false); // This should close the dialog
        OnGenerateTrip(); // Proceed with your trip generation logic
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
      });
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
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">Pour combien de jours ?</h2>
          <Input
            placeholder={"Ex.3"}
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
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
              ${formData?.budget==item.title&&'shadow-lg border-black'}
              `}>
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
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
              ${formData?.traveler==item.people&&'shadow-lg border-black'}
              `}>
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button 
        disabled = {loading}
        onClick={OnGenerateTrip}>
          {loading?
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin"/>: 'Generate Trip'
          }
          Générer un voyage
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg"/>
              <h2 className='font-bold text-lg'>Connectez-vous avec Google</h2>
              <p>Connectez-vous de façon sécurisée à l'application avec Google Authentication</p>
              
              <Button 
              onClick={login}
              className="w-full mt-5 flex gap-4 items-center">

              <FcGoogle className="h-7 w-7"/>
              Connectez-vous avec Google
              </Button>
                
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default CreateTrip;
