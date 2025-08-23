import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "~/service/firebaseConfig"
import UserTripCardItem from "./components/UserTripCardItem"
import Footer from "~/view-trip/components/Footer"

/**
 * Page "Mes voyages".
 * Je récupère les trips Firestore de l’utilisateur connecté (via son email stocké en localStorage).
 * Si je ne trouve pas d’utilisateur, je redirige vers l’accueil.
 */
export default function MyTrips() {
  const navigate = useNavigate()
  const [userTrips, setUserTrips] = useState([])

  /* Charge les voyages de l’utilisateur connecté */
  useEffect(() => {
    ;(async () => {
      // Je lis l’utilisateur depuis localStorage ; sans session je renvoie vers "/".
      const stored = localStorage.getItem("user")
      if (!stored) return navigate("/")

      // Je requête les documents AITrips filtrés par l’email de l’utilisateur.
      const { email } = JSON.parse(stored)
      const snap      = await getDocs(
        query(collection(db, "AITrips"), where("userEmail", "==", email))
      )
      // Je normalise chaque doc pour exposer un id cohérent au composant enfant.
      setUserTrips(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })()
    // Je désactive l’exhaustive-deps volontairement ici, je veux ce chargement une seule fois.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <section className="pt-28 pb-20 px-6 md:px-32">
        <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-10">
            Mes voyages
          </h2>

          {/* Affichage vide : je propose un CTA pour créer un premier trip */}
          {userTrips.length === 0 ? (
            <div className="flex flex-col items-center py-24">
              <p className="text-lg text-gray-600 mb-6">
                Aucun voyage trouvé.
              </p>
              <button
                onClick={() => navigate("/create-trip")}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Créer un nouveau voyage
              </button>
            </div>
          ) : (
            /* Grille de voyages : je délègue le rendu de chaque carte au composant dédié */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {userTrips.map((trip) => (
                <UserTripCardItem key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

    </div>
    
  )
}
