// Layout racine : je place l’en-tête global, la zone de contenu (Outlet) et le pied de page.
// Je ne change rien au code exécutable ; j’ajoute uniquement des commentaires pour clarifier le rôle de chaque partie.

import React from 'react';
import Header from '~/components/custom/Header';
import Footer from '~/view-trip/components/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      {/* En-tête global affiché sur toutes les pages */}
      <Header />

      {/* Le main est transparent pour laisser voir le gradient */}
      {/* Je réserve un padding-top de 5rem (~pt-20) pour ne pas passer sous le header fixé.
          min-h calcule une hauteur minimale pour que le footer reste en bas sur les pages courtes. */}
      <main className="pt-20 bg-transparent min-h-[calc(100vh-5rem)]">
        {/* Je laisse React Router injecter ici la page courante */}
        <Outlet />
      </main>

      {/* Pied de page commun au site */}
      <Footer />
    </>
  );
}
