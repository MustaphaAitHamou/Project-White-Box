// Mock léger du composant "BackgroundBeams" pour les tests.
// Ici je fournis un rendu neutre pour éviter tout effet visuel pendant les tests.
// Je garde la même API que le composant réel : je laisse passer toutes les props telles quelles.
// Je mets un data-testid pour pouvoir cibler facilement l’élément dans les tests.
// Si un jour je dois simuler un comportement, je pourrai enrichir ce mock sans toucher au reste.

import React from 'react';

// Je conserve la signature d’origine pour rester interchangeable en test.
export default function BackgroundBeamsMock(props) {
  // Je rends simplement une <div> unique, stable pour les snapshots.
  return <div data-testid="bg-beams" {...props} />;
}
