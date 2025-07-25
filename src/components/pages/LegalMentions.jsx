
function LegalMentions() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Mentions légales</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
          <p>
            TripGenius est édité par <strong>Negan Yaghmoracen Aït-Yidir</strong>, fondateur de la société TAMURT SERVICES LLC.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
          <p>
            Le site est hébergé par <strong>IGLAO HOSTING</strong><br />
            Adresse : F85 QUARTIER LE PONT, 07580 SAINT-PONS, FRANCE<br />
            Site web : <a href="https://iglao.com" className="text-blue-600 underline">https://iglao.com</a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Responsabilité</h2>
          <p>
            L’éditeur ne peut être tenu responsable des dommages directs ou indirects causés au matériel de l’utilisateur lors de l’accès au site.
            L’utilisateur du site s’engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus, et avec un navigateur mis à jour.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
          <p>
            Tous les contenus présents sur le site TripGenius (textes, images, logos, vidéos, etc.) sont la propriété exclusive de l’éditeur, sauf mention contraire.
            Toute reproduction, distribution ou modification sans autorisation écrite est interdite.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Données personnelles</h2>
          <p>
            Les informations collectées lors de l’utilisation du site sont traitées dans le respect de la réglementation en vigueur. Pour plus d’informations,
            consultez notre <a href="/privacy-policy" className="text-blue-600 underline">politique de confidentialité</a>.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p>
            Pour toute question, vous pouvez nous contacter à l’adresse suivante : <a href="mailto:contact@tripgenius.ai" className="text-blue-600 underline">contact@tripgenius.ai</a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LegalMentions;
