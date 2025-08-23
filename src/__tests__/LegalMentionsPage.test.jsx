/* eslint-env jest */
/* 
  Test unitaire très simple pour la page Mentions légales :
  je rends le composant et je vérifie que le titre attendu apparaît bien dans le DOM.
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import LegalMentions from '~/components/pages/LegalMentions';

test('LegalMentions affiche Mentions légales', () => {
  // Je monte le composant tel qu’il s’affichera côté UI.
  render(<LegalMentions />);

  // Je m’assure que le libellé “Mentions légales” est présent (recherche insensible à la casse).
  expect(screen.getByText(/mentions légales/i)).toBeInTheDocument();
});
