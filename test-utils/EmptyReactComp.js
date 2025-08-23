// Composant minimal « vide » pour les tests et les rendus de secours.
// Je ne gère aucune logique : je rends juste un <div> neutre avec un data-testid stable.
// Je propage toutes les props reçues pour laisser le parent contrôler l’apparence et les events.

import React from 'react';

export default function EmptyReactComp(props) {
  // Je garde le spread {...props} pour permettre de passer className, style, aria-*, etc.
  return <div data-testid="empty-comp" {...props} />;
}
