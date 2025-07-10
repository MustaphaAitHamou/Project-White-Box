import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { db } from "~/service/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"
import InfoSection from "../components/InfoSection"
import Hotels from "../components/Hotels"
import PlacesToVisit from "../components/PlacesToVisit"
import Footer from "../components/Footer"

export default function ViewTrip() {
  const { tripId } = useParams()
  const navigate   = useNavigate()
  const [trip, setTrip] = useState(null)

  useEffect(() => {
    if (tripId) fetchTrip()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId])

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <section className="pt-28 pb-20 px-6 md:px-32">
        <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-3xl p-10 shadow-2xl">
          {trip ? (
            <>
              <InfoSection trip={trip} />
              <div className="bg-gray-100 rounded-xl shadow p-8 my-8">
                <h3 className="text-2xl font-bold mb-6">Hôtels recommandés</h3>
                <Hotels trip={trip} />
              </div>
              <div className="bg-gray-100 rounded-xl shadow p-8">
                <h3 className="text-2xl font-bold mb-6">Itinéraire quotidien</h3>
                <PlacesToVisit trip={trip} />
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">Chargement du voyage…</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
