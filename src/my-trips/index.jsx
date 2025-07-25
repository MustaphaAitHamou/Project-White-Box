// src/my-trips/index.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/service/firebaseConfig';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = (() => {
    try { return JSON.parse(localStorage.getItem('user'))?.email; } catch { return null; }
  })();

  useEffect(() => {
    (async () => {
      try {
        const baseCol = collection(db, 'AITrips');
        const q = email ? query(baseCol, where('user.email', '==', email)) : baseCol;
        const snap = await getDocs(q);
        setTrips(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [email]);

  if (loading) return <p className="py-20 text-center">Chargement…</p>;

  if (!trips.length) {
    return (
      <div className="text-center space-y-4 py-20">
        <p>Aucun voyage trouvé</p>
        <Link
          to="/create-trip"
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Créer un nouveau voyage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((t) => {
        const label  = t?.userSelection?.location?.label || 'Voyage';
        const days   = t?.userSelection?.noOfDays;
        const budget = t?.userSelection?.budget;
        return (
          <Link
            key={t.id}
            to={`/view-trip/${t.id}`}
            className="block rounded-xl bg-white shadow p-4 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-indigo-700">{label}</h3>
            <p className="text-sm text-gray-600">
              {days ? `${days} jours` : ''}{budget ? ` • ${budget}` : ''}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
