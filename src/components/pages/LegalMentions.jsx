import React from 'react';
import Footer from '~/view-trip/components/Footer';

export default function LegalMentions() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="bg-slate-800 bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-violet-400 mb-8">Mentions légales</h1>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Éditeur du site</h2>
            <p>
              TripGenius est édité par <strong>Negan Yaghmoracen Aït-Yidir</strong>, fondateur de la société TAMURT SERVICES LLC.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Hébergement</h2>
            <p>
              Le site est hébergé par <strong>IGLAO HOSTING</strong><br />
              Adresse : F85 QUARTIER LE PONT, 07580 SAINT-PONS, FRANCE<br />
              Site web : <a href="https://iglao.com" className="text-violet-400 underline">https://iglao.com</a>
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Responsabilité</h2>
            <p>
              L’éditeur ne peut être tenu responsable des dommages directs ou indirects causés au matériel de l’utilisateur lors de l’accès au site.
              L’utilisateur du site s’engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus, et avec un navigateur mis à jour.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Propriété intellectuelle</h2>
            <p>
              Tous les contenus présents sur le site TripGenius (textes, images, logos, vidéos, etc.) sont la propriété exclusive de l’éditeur, sauf mention contraire.
              Toute reproduction, distribution ou modification sans autorisation écrite est interdite.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Données personnelles</h2>
            <p>
              Les informations collectées sont traitées dans le respect de la réglementation en vigueur.
              Consultez notre <a href="/privacy-policy" className="text-violet-400 underline">politique de confidentialité</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Contact</h2>
            <p>
              Pour toute question : <a href="mailto:contact@tripgenius.ai" className="text-violet-400 underline">contact@tripgenius.ai</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
