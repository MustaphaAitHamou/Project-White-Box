import React from 'react'; // juste pour ESLint

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center px-4 py-16">
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Politique de confidentialité</h1>
        <p className="text-gray-700 mb-6">
          Chez <strong>TripGenius</strong>, nous accordons une grande importance à la protection de vos données personnelles. Cette page explique comment nous collectons, utilisons et protégeons vos informations.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">1. Données collectées</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Informations issues de la connexion via Google (nom, email, image de profil)</li>
          <li>Préférences de voyage saisies par l’utilisateur</li>
          <li>Données techniques (cookies, journaux d’erreurs, etc.)</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">2. Utilisation des données</h2>
        <p className="text-gray-700">
          Ces données sont utilisées uniquement pour personnaliser votre expérience, générer des itinéraires et assurer le bon fonctionnement du service.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">3. Sécurité et conservation</h2>
        <p className="text-gray-700">
          Vos données sont stockées de manière sécurisée sur Firebase. Nous ne partageons jamais vos informations avec des tiers sans votre consentement.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">4. Vos droits</h2>
        <p className="text-gray-700">
          Conformément au RGPD, vous pouvez à tout moment demander l’accès, la modification ou la suppression de vos données personnelles.
        </p>

      </div>
    </div>
  );
}
