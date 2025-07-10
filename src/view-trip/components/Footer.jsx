/* ------------------------------------------------------------------
   src/components/Footer.jsx   (version sans marge externe)
------------------------------------------------------------------- */
import React from "react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-gray-700 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center space-y-6">
        <p className="text-sm text-gray-400">
          Créé par{" "}
          <span className="font-semibold text-indigo-400">
            Aknanir nAth&nbsp;Yetturagh
          </span>
        </p>

        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <Link
            to="/privacy-policy"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Politique de confidentialité
          </Link>
          <Link
            to="/cookie-settings"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Paramètres des cookies
          </Link>
          <Link
            to="/legal-mentions"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Mentions légales
          </Link>
          <Link
            to="/sitemap"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Plan du site
          </Link>
        </nav>
      </div>
    </footer>
  )
}
