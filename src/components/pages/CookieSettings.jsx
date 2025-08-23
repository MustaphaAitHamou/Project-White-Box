// Page de gestion des préférences cookies.
// Je garde une structure simple : un main centré avec un formulaire minimal.
// Les cases "statistiques" et "marketing" sont libres, l’"essentiel" est figée.

import React from 'react';
import Footer from '~/view-trip/components/Footer';

export default function CookieSettings() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      {/* Zone centrale : carte semi-transparente avec flou d’arrière-plan */}
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="bg-slate-800 bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-4xl w-full">
          {/* Titre de la page */}
          <h1 className="text-3xl font-bold text-indigo-400 mb-6">Paramètres des cookies</h1>

          {/* Intro brève pour contextualiser le formulaire */}
          <p className="mb-4">
            Vous pouvez ici personnaliser les types de cookies que vous acceptez.
          </p>

          {/* Formulaire simple : 3 catégories, puis un bouton d’enregistrement.
              Je n’ajoute pas de logique ici : c’est un gabarit d’UI prêt à brancher. */}
          <form className="space-y-4">
            {/* Essentiels : toujours activés et non modifiables */}
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked disabled />
              <span>Cookies essentiels (obligatoires)</span>
            </label>

            {/* Optionnels : à relier à la logique de consentement côté app */}
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="statistics" />
              <span>Cookies statistiques</span>
            </label>

            <label className="flex items-center space-x-3">
              <input type="checkbox" name="marketing" />
              <span>Cookies marketing</span>
            </label>

            {/* CTA : à connecter à une fonction de persistance (ex: localStorage + toast) */}
            <button
              type="submit"
              className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
            >
              Enregistrer mes préférences
            </button>
          </form>
        </div>
      </main>

      {/* Pied de page commun au site */}
      <Footer />
    </div>
  );
}
