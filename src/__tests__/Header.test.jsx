// src/__tests__/Header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '@/components/custom/Header';

// Mock de react-oauth/google pour bypasser le contexte GoogleOAuthProvider
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: () => () => {},        // hook qui renvoie une fonction noop
  GoogleOAuthProvider: ({ children }) => <>{children}</>, // passthrough
  googleLogout: jest.fn(),
}));

beforeEach(() => {
  window.localStorage.clear();
});

describe('Header', () => {
  it('affiche le bouton de connexion si pas d’utilisateur', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
    expect(screen.queryByText(/Mes voyages/i)).toBeNull();
  });

  it('affiche "Mes voyages" et l’avatar quand utilisateur present', () => {
    window.localStorage.setItem('user', JSON.stringify({ email: 'test@ex.com', picture: 'avatar.png' }));
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText(/Mes voyages/i)).toBeInTheDocument();
    expect(screen.getByAltText('avatar')).toHaveAttribute('src', 'avatar.png');
  });
});
