// src/my-trips/index.jsx
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
  }, []);

  const loadUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }

    // Vide la liste avant le fetch
    setUserTrips([]);
    const q = query(
      collection(db, 'AITrips'),
      where('userEmail', '==', user.email)
    );

    const snapshot = await getDocs(q);
    const trips = [];
    snapshot.forEach(doc => {
      trips.push({ id: doc.id, ...doc.data() });
    });
    setUserTrips(trips);
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl mb-6">Mes voyages</h2>
      {userTrips.length === 0 ? (
        <p>Aucun voyage trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userTrips.map(trip => (
            <UserTripCardItem
              key={trip.id}    // ← clé unique pour chaque élément
              trip={trip}      // ← on passe bien le trip en prop
            />
          ))}
        </div>
      )}
    </div>
  );
}
