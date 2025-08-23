import React from 'react';
import InfoSection   from '../components/InfoSection';
import Hotels        from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer        from '../components/Footer';
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { db } from "~/service/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"

/**
 * Page de visualisation d’un voyage.
 * Je récupère le trip depuis Firestore à partir de l’ID d’URL,
 * puis j’affiche les sections Info, Hôtels et Itinéraire.
 */
export default function ViewTrip() {
  const { tripId } = useParams()
  const navigate   = useNavigate()
  // Je stocke le document Firestore complet pour alimenter les sous-composants.
  const [trip, setTrip] = useState(null)

  useEffect(() => {
    // À chaque changement d’ID, je tente de charger le voyage.
    if (tripId) fetchTrip()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId])

  // Je lis le document "AITrips/{tripId}" ;
  // si rien n’est trouvé, je notifie et je renvoie l’utilisateur vers ses voyages.
  async function fetchTrip() {
    try {
      const snap = await getDoc(doc(db, "AITrips", tripId))
      if (!snap.exists()) {
        toast.error("Voyage introuvable")
        return navigate("/my-trips")
      }
      setTrip(snap.data())
    } catch (err) {
      console.error(err)
      toast.error("Erreur de chargement")
    }
  }

  return (
    // Mise en page : fond dégradé, carte centrale avec blur pour la lisibilité.
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <section className="pt-28 pb-20 px-6 md:px-32">
        <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-3xl p-10 shadow-2xl">
          {trip ? (
            <>
              {/* En-tête d’infos générales sur le voyage (destination, durée, badges, image) */}
              <InfoSection trip={trip} />

              {/* Bloc hôtels : je délègue la logique d’affichage au composant dédié */}
              <div className="bg-gray-100 rounded-xl shadow p-8 my-8">
                <h3 className="text-2xl font-bold mb-6">Hôtels recommandés</h3>
                <Hotels trip={trip} />
              </div>

              {/* Bloc itinéraire : tri/formatage géré dans PlacesToVisit */}
              <div className="bg-gray-100 rounded-xl shadow p-8">
                <h3 className="text-2xl font-bold mb-6">Itinéraire quotidien</h3>
                <PlacesToVisit trip={trip} />
              </div>
            </>
          ) : (
            // État de chargement simple tant que je n’ai pas le document.
            <p className="text-center text-gray-600">Chargement du voyage…</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
