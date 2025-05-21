// src/components/Header.jsx
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log(user)
  }, [])

  const login = useGoogleLogin({
    onSuccess: getUserProfile,
    onError: err => console.error("OAuth Error:", err),
    flow: "implicit",
    ux_mode: "popup",
    scope: "openid email profile"
  });

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
      window.location.reload();
    } catch (err) {
      console.error("Error fetching user profile:", err);
      toast.error("Impossible de récupérer le profil Google");
    }
  }

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src="/logo.svg" alt="Logo" />

      <div>
        {user ? (
          <div className='flex items-center gap-3'>
            <a href='/my-trips'>
              <Button variant="outline" className='rounded-full'>
                Mes voyages
              </Button>
            </a>

            <Popover>
              {/* asChild retire le <button> auto-généré */}
              <PopoverTrigger asChild>
                {/* Ici, juste un <img> cliquable sans fond */}
                <img
                  src={user.picture}
                  alt="Avatar"
                  className='h-[35px] w-[35px] rounded-full object-cover cursor-pointer'
                />
              </PopoverTrigger>

              <PopoverContent>
                <h2
                  className='cursor-pointer'
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Déconnexion
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>
            Connectez-vous
          </Button>
        )}
      </div>

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
  )
}
