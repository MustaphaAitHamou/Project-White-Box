
export default function Sitemap() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-blue-50 py-20 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">Plan du site</h1>
        <p className="mb-8 text-gray-600">Voici les principales pages accessibles sur TripGenius :</p>

        <ul className="space-y-4 text-lg">
          <li>
            <Link
              to="/"
              className="text-blue-600 hover:underline hover:text-blue-800 transition"
            >
              • Accueil
            </Link>
          </li>
          <li>
            <Link
              to="/create-trip"
              className="text-blue-600 hover:underline hover:text-blue-800 transition"
            >
              • Créer un voyage
            </Link>
          </li>
          <li>
            <Link
              to="/my-trips"
              className="text-blue-600 hover:underline hover:text-blue-800 transition"
            >
              • Mes voyages
            </Link>
          </li>
          <li>
            <Link
              to="/privacy-policy"
              className="text-blue-600 hover:underline hover:text-blue-800 transition"
            >
              • Politique de confidentialité
            </Link>
          </li>
          <li>
            <Link
              to="/cookies-settings"
              className="text-blue-600 hover:underline hover:text-blue-800 transition"
            >
              • Paramètres des cookies
            </Link>
          </li>
          <li>
            <Link
              to="/legal-mentions"
              className="text-blue-600 hover:underline hover:text-blue-800 transition"
            >
              • Mentions légales
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
