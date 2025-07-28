import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-6 px-4 text-center space-y-3"> 
      <div className="space-x-4">
        <Link to="/privacy-policy" className="text-violet-400 hover:underline">Confidentialité</Link>
        <Link to="/cookie-settings" className="text-violet-400 hover:underline">Cookies</Link>
        <Link to="/legal-mentions" className="text-violet-400 hover:underline">Mentions légales</Link>
        <Link to="/sitemap" className="text-violet-400 hover:underline">Plan du site</Link>
        <Link to="/contact" className="text-violet-400 hover:underline">Contact</Link>
        <a
          href="https://coff.ee/aknanirnathyetturagh" 
          target="_blank"
          rel="noopener noreferrer" 
          className="text-violet-400 hover:underline"  
        >
          ☕ Buy me a coffee 
        </a>
      </div>
      <p className="text-sm text-gray-400 mt-2">
        © {new Date().getFullYear()} TripGenius. Tous droits réservés.
      </p>
    </footer>
  );
}
