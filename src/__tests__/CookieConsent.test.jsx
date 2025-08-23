/* eslint-env jest */
/* 
  Tests unitaires de la bannière de consentement cookies.
  Je vérifie :
    1) l’affichage par défaut quand aucun consentement n’est stocké ;
    2) le flux “Accepter” qui doit persister le choix en localStorage
       et masquer la bannière.
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CookieConsent from '~/components/ui/CookiesConsent';

// Je repars d’un storage propre avant chaque test pour éviter les effets de bord.
beforeEach(() => localStorage.clear());

test('affiche la bannière si aucun consentement', () => {
  render(<CookieConsent />);
  // Je m’assure que le titre/texte de la bannière est présent.
  expect(screen.getByText(/gestion des cookies/i)).toBeInTheDocument();
});

test('accepte tout et enregistre dans localStorage', () => {
  render(<CookieConsent />);
  // Je clique sur le bouton “Accepter” comme le ferait un utilisateur.
  fireEvent.click(screen.getByRole('button', { name: /accepter/i }));
  // Je lis la valeur persistée et je vérifie les catégories activées.
  const stored = JSON.parse(localStorage.getItem('cookie_consent'));
  expect(stored.statistics).toBe(true);
  expect(stored.marketing).toBe(true);
  // Après acceptation, la bannière ne doit plus être visible.
  expect(screen.queryByText(/gestion des cookies/i)).not.toBeInTheDocument();
});
