/* eslint-env jest */
/**
 * Test unitaire minimal pour la page Politique de confidentialité.
 * Je rends le composant et je vérifie que le titre attendu apparaît dans le DOM.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivacyPolicy from '~/components/pages/PrivacyPolicy';

test('PrivacyPolicy affiche Politique de confidentialité', () => {
  // Je monte le composant tel qu’il s’affiche côté UI.
  render(<PrivacyPolicy />);
  // Je m’assure que le libellé « Politique de confidentialité » est présent (recherche insensible à la casse).
  expect(screen.getByText(/politique de confidentialité/i)).toBeInTheDocument();
});
