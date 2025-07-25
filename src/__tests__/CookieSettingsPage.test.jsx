/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import CookieSettings from '~/components/pages/CookieSettings';

test('CookieSettings affiche le titre et le bouton', () => {
  render(<CookieSettings />);
  expect(screen.getByText(/paramètres des cookies/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();
});
