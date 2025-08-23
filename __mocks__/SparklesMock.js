// Mock léger du composant "SparklesCore" pour les tests.
// Je fournis un rendu neutre pour éviter tout effet visuel superflu.
// Je garde la même API : je laisse passer toutes les props (className, style, etc.).
// Je mets data-testid="sparkles" pour pouvoir le cibler facilement dans les tests (RTL).

import React from 'react';

export default function SparklesCoreMock(props) {
  // Je rends simplement une <div> unique : suffisant pour les snapshots et assertions.
  return <div data-testid="sparkles" {...props} />;
}
