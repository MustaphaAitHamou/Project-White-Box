import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { db } from '~/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

export default function ViewTrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      const ref = doc(db, 'AITrips', tripId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        toast.error('Voyage introuvable');
        navigate('/my-trips');
        return;
      }
      setTrip(snap.data());
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement du voyage');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Static gradient background matching Hero */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500" />

      <section className="relative pt-24 pb-16 px-4 sm:px-10 md:px-32 lg:px-56 xl:px-72">
        <div className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-16">
          {trip ? (
            <>
              {/* Information Section */}
              <InfoSection trip={trip} />

              {/* Recommended Hotels */}
              <div className="bg-gray-50 rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Hôtels recommandés
                </h3>
                <Hotels trip={trip} />
              </div>

              {/* Daily Plan */}
              <div className="bg-gray-50 rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Itinéraire quotidien
                </h3>
                <PlacesToVisit trip={trip} />
              </div>

              {/* Footer */}
              <Footer trip={trip} />
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-lg text-gray-600">Chargement du voyage...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
