import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '~/service/firebaseConfig';
import UserTripCardItem from './components/UserTripCardItem';

export default function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    loadUserTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserTrips = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    const user = JSON.parse(storedUser);
    setUserTrips([]);

    const q = query(
      collection(db, 'AITrips'),
      where('userEmail', '==', user.email)
    );

    const snapshot = await getDocs(q);
    const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUserTrips(trips);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Static gradient background matching Hero */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500" />

      <section className="relative pt-24 pb-16 px-4 sm:px-10 md:px-32 lg:px-56 xl:px-72">
        <div className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
            Mes voyages
          </h2>

          {userTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-lg text-gray-600 mb-4">Aucun voyage trouvé.</p>
              <button
                onClick={() => navigate('/create-trip')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                Créer un nouveau voyage
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {userTrips.map(trip => (
                <UserTripCardItem key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
