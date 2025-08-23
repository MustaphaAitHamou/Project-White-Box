/* eslint-env jest */
/* 
  Test unitaire de la page "Paramètres des cookies".
  Je vérifie deux points d’accessibilité/présence basiques :
    1) le titre principal est bien rendu ;
    2) le bouton d’action “Enregistrer” est présent dans le DOM.
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import CookieSettings from '~/components/pages/CookieSettings';

test('CookieSettings affiche le titre et le bouton', () => {
  // Je monte le composant tel qu’il s’affichera côté UI.
  render(<CookieSettings />);

  // Je m’assure que le titre est visible (insensible à la casse via /i).
  expect(screen.getByText(/paramètres des cookies/i)).toBeInTheDocument();

  // Je cible le bouton par son rôle accessible et son libellé.
  expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();
});
