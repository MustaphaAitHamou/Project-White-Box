/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CookieConsent from '~/components/ui/CookiesConsent';

beforeEach(() => localStorage.clear());

test('affiche la bannière si aucun consentement', () => {
  render(<CookieConsent />);
  expect(screen.getByText(/gestion des cookies/i)).toBeInTheDocument();
});

test('accepte tout et enregistre dans localStorage', () => {
  render(<CookieConsent />);
  fireEvent.click(screen.getByRole('button', { name: /accepter/i }));
  const stored = JSON.parse(localStorage.getItem('cookie_consent'));
  expect(stored.statistics).toBe(true);
  expect(stored.marketing).toBe(true);
  // la bannière disparaît
  expect(screen.queryByText(/gestion des cookies/i)).not.toBeInTheDocument();
});
