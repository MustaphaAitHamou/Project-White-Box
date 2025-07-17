/* ------------------------------------------------------------------
   src/create-trip/index.jsx
   Page : Création d’un voyage (illimité en jours)
------------------------------------------------------------------- */
import React, { useState } from 'react'
import axios from 'axios'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from '~/constants/options'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { toast } from 'sonner'
import { generateTripPlan } from '~/service/AIModal'
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '~/components/ui/dialog'
import { FcGoogle } from 'react-icons/fc'
import { X } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '~/service/firebaseConfig'
import { useNavigate } from 'react-router-dom'
import Footer from '~/view-trip/components/Footer'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function CreateTrip() {
  /* ---------- état local ---------- */
  const [place, setPlace] = useState(null)
  const [formData, setFormData] = useState({})
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [consentError, setConsentError] = useState('')

  const navigate = useNavigate()
  const update   = (k, v) => setFormData((p) => ({ ...p, [k]: v }))

  /* ---------- OAuth Google ---------- */
  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        /* profil Google */
        const { data } = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
        )
        localStorage.setItem('user', JSON.stringify(data))
        window.dispatchEvent(new Event('userChanged'))

        /* enregistre le consentement RGPD */
        await setDoc(doc(db, 'consents', data.id), {
          email: data.email,
          consent: true,
          timestamp: new Date().toISOString(),
        })

        setOpenDialog(false)
        generateTrip()
      } catch {
        toast.error('Impossible de récupérer le profil Google')
      }
    },
    onError : () => toast.error("Échec de l'authentification Google"),
    ux_mode : 'popup',
    scope   : 'openid email profile',
  })

  /* ---------- Appel IA ---------- */
  async function generateTrip() {
    if (!localStorage.getItem('user')) return setOpenDialog(true)

    const { location, noOfDays, budget, traveler } = formData
    if (!location || !noOfDays || !budget || !traveler)
      return toast.error('Veuillez remplir tous les champs')

    setLoading(true)

    /* interpolation du prompt */
    const prompt = AI_PROMPT
      .replace('{location}', location.label)
      .replace(/{totalDays}/g, noOfDays)
      .replace('{traveler}', traveler)
      .replace('{budget}', budget)

    try {
      const res = await generateTripPlan(prompt)

      const id = Date.now().toString()
      await setDoc(doc(db, 'AITrips', id), {
        userSelection: formData,
        TripData     : res,
        userEmail    : JSON.parse(localStorage.getItem('user')).email,
        id,
      })

      navigate(`/view-trip/${id}`)
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  /* ------------------------- UI ------------------------- */
  return (
    <>
      {/* ╔══════════════ Wrapper gradient ══════════════╗ */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <section className="py-16 px-6 md:px-20">
          <div className="mx-auto max-w-5xl bg-white/80 backdrop-blur-lg border border-white/30 rounded-3xl p-10 shadow-2xl">
            <h2 className="text-3xl font-extrabold text-gray-800 text-center">
              Crée ton voyage
            </h2>

            {/* ----------- Formulaire ----------- */}
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {/* Colonne gauche */}
              <div className="space-y-8">
                {/* Destination */}
                <div>
                  <label className="font-semibold text-gray-700">
                    Destination
                  </label>
                  <GooglePlacesAutocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                    selectProps={{
                      value: place,
                      onChange: (v) => {
                        setPlace(v)
                        update('location', v)
                      },
                      className: 'mt-2 rounded-lg border-gray-300',
                    }}
                  />
                </div>

                {/* Nombre de jours */}
                <div>
                  <label className="font-semibold text-gray-700">
                    Nombre de jours
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="5"
                    className="w-32 mt-2"
                    onChange={(e) => update('noOfDays', e.target.value)}
                  />
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-8">
                {/* Budget */}
                <div>
                  <p className="font-semibold text-gray-700">Budget</p>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {SelectBudgetOptions.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => update('budget', b.title)}
                        className={`rounded-xl p-4 flex flex-col items-center gap-1 transition-all ${
                          formData.budget === b.title
                            ? 'bg-gray-800 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span className="text-2xl">{b.icon}</span>
                        <span className="text-xs font-medium">
                          {b.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voyageurs */}
                <div>
                  <p className="font-semibold text-gray-700">Voyageurs</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                    {SelectTravelesList.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => update('traveler', t.people)}
                        className={`rounded-xl p-4 flex flex-col items-center gap-1 transition-all ${
                          formData.traveler === t.people
                            ? 'bg-gray-800 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span className="text-2xl">{t.icon}</span>
                        <span className="text-xs font-medium">
                          {t.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton Générer */}
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
                    Création…
                  </>
                ) : (
                  'Générer'
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* ╠════ Dialog Connexion Google ════╣ */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-bold">
                Connexion Google
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Connecte‑toi pour continuer.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex items-start gap-2">
              <input
                id="rgpd"
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => {
                  setConsentChecked(e.target.checked)
                  setConsentError('')
                }}
              />
              <label htmlFor="rgpd" className="text-sm text-gray-700">
                J’accepte l’utilisation de mes données.
              </label>
            </div>
            {consentError && (
              <p className="text-red-500 text-sm mt-2">{consentError}</p>
            )}

            <Button
              onClick={() => {
                if (!consentChecked) {
                  setConsentError('Merci d’accepter les conditions')
                  return
                }
                login()
              }}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white"
            >
              <FcGoogle className="h-5 w-5" />
              Continuer avec Google
            </Button>

            <DialogClose asChild>
              <button
                type="button"
                aria-label="Fermer"
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      {/* ╚════════════════ Footer ═════════════════╝ */}
      <Footer />
    </>
  )
}
