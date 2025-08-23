// Section d’accueil simple et lisible : titre, sous-texte et CTA vers la création de voyage.
// Je garde une structure minimale pour rester rapide à charger et facile à tester.
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import Footer from '~/view-trip/components/Footer';

export default function Hero() {
  return (
    // Je prends toute la hauteur de l’écran, avec un arrière-plan en dégradé sombre.
    // L’objectif est de faire ressortir le titre et le CTA.
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Zone centrale : je centre verticalement et horizontalement le contenu */}
      <section className="flex-1 flex items-center justify-center px-4">
        {/* Je limite la largeur pour garder une bonne lisibilité sur grands écrans */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Titre principal très visible ; tailles adaptées selon le viewport */}
          <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
            Explorez l’inconnu.
          </h1>

          {/* Accroche courte : je reste concis pour ne pas diluer l’appel à l’action */}
          <p className="mt-6 text-lg text-gray-300">
            Laissez l’intelligence artificielle planifier votre prochaine aventure.
          </p>

          {/* CTA : je passe par Link pour une navigation client-side vers /create-trip */}
          <Link to="/create-trip">
            <Button className="mt-8 text-lg shadow-xl">Créer un voyage</Button>
          </Link>
        </div>
      </section>

      {/* Pied de page réutilisable pour la cohérence globale du site */}
      <Footer />
    </div>
  );
}
