// src/components/Footer.jsx

import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 px-6 py-8 bg-transparent">  {/* fond transparent */}
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-600 text-sm mb-3">
          Créé par <span className="font-semibold text-indigo-600">Aknanir nAth Yetturagh</span>
        </p>
        <nav className="flex justify-center flex-wrap gap-6 text-sm text-gray-500">
          <Link to="/privacy-policy" className="hover:text-indigo-600 transition">
            Politique de confidentialité
          </Link>
          <Link to="/cookie-settings" className="hover:text-indigo-600 transition">
            Paramètres des cookies
          </Link>
          <Link to="/legal-mentions" className="hover:text-indigo-600 transition">
            Mentions légales
          </Link>
          <Link to="/sitemap" className="hover:text-indigo-600 transition">
            Plan du site
          </Link>
        </nav>
      </div>
    </footer>
  );
}
