/* ------------------------------------------------------------------ */
/*  src/App.jsx – wrapper appli accueil                               */
/*  (Hero plein écran, gradient géré dans Hero)                       */
/* ------------------------------------------------------------------ */

import React from 'react';
import Hero from '~/components/custom/Hero';

export default function App() {
  // Je délègue tout l’affichage d’accueil au composant Hero.
  // Je ne gère ici aucune logique d’état ni de routing : App joue le rôle d’enveloppe minimale.
  return <Hero />;
}
