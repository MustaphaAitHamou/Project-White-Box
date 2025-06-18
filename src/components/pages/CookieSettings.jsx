// src/components/pages/CookieSettings.jsx
import React from 'react';

export default function CookieSettings() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-blue-50 py-20 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">Paramètres des cookies</h1>
        <p className="mb-4 text-gray-700">
          Vous pouvez ici personnaliser les types de cookies que vous acceptez.
        </p>

        <form className="space-y-4">
          <div>
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked disabled />
              <span>Cookies essentiels (obligatoires)</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="statistics" />
              <span>Cookies statistiques</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="marketing" />
              <span>Cookies marketing</span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            Enregistrer mes préférences
          </button>
        </form>
      </div>
    </div>
  );
}
