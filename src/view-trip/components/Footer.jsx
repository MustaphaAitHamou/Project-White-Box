
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center space-y-6">
        <p className="text-sm">
          Créé avec ❤️ par&nbsp;
          <span className="font-semibold text-violet-400">
            Aknanir nAth Yetturagh
          </span>
        </p>

        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <Link to="/privacy-policy"  className="hover:text-violet-300">Politique de confidentialité</Link>
          <Link to="/cookie-settings" className="hover:text-violet-300">Paramètres des cookies</Link>
          <Link to="/legal-mentions"  className="hover:text-violet-300">Mentions légales</Link>
          <Link to="/sitemap"         className="hover:text-violet-300">Plan du site</Link>
        </nav>
      </div>
    </footer>
  )
}
