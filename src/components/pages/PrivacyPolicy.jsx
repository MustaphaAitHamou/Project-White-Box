import React from 'react';
import Footer from '~/view-trip/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="bg-slate-800 bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-violet-400 mb-8">Politique de confidentialité</h1>
          <p className="mb-6">
            Chez <strong>TripGenius</strong>, nous accordons une grande importance à la protection de vos données personnelles.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-2">1. Données collectées</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Connexion Google (nom, email, photo)</li>
            <li>Préférences de voyage saisies</li>
            <li>Données techniques (cookies, logs)</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8 mb-2">2. Utilisation</h2>
          <p>Pour personnaliser l’expérience utilisateur, générer les itinéraires et faire fonctionner le service.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-2">3. Sécurité</h2>
          <p>Les données sont stockées sur Firebase. Aucune transmission à des tiers sans votre consentement.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-2">4. Vos droits</h2>
          <p>Conformément au RGPD, vous pouvez demander l’accès, la modification ou la suppression de vos données.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
