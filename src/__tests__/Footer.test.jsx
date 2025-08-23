/* eslint-env jest */
// Test “smoke” ultra-basique du composant Footer.
// Je vérifie simplement que le rendu ne jette pas d’erreur
// et qu’il y a bien un premier nœud dans le container.
// Je n’affirme rien sur le contenu : l’objectif est juste de contribuer au coverage.

import React from 'react';
import { render } from '@testing-library/react';
import Footer from '~/view-trip/components/Footer';

test('Footer se rend sans crasher', () => {
  const { container } = render(<Footer />);
  // Je m’assure qu’un premier enfant existe dans le DOM retourné.
  // Si le rendu échoue, ce test échouera aussi.
  expect(container.firstChild).toBeTruthy();
});
