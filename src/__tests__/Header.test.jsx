/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '@/components/custom/Header.jsx';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

/**
 * J’initialise une variable globale mimant l’injection d’env (Vite)
 * pour éviter que le composant ne casse lorsqu’il lit window.__ENV__.
 */
beforeAll(() => {
  global.window = Object.create(window);
  window.__ENV__ = { VITE_RECAPTCHA_SITE_KEY: 'fake-key' };
});

/**
 * Je mocke le module OAuth Google :
 * - useGoogleLogin : je contrôle son comportement dans les tests
 * - googleLogout  : je vérifie qu’il est bien appelé au logout
 */
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(),
  googleLogout: jest.fn(),
}));

/**
 * Avant chaque test :
 * - je nettoie localStorage (si disponible)
 * - je réinitialise tous les mocks/espions Jest
 */
beforeEach(() => {
  try {
    localStorage.clear();
  } catch {
    // ignore
  }
  jest.clearAllMocks();
});

describe('🔐 Header', () => {
  it('affiche le bouton "Connexion", ouvre le dialog et déclenche le login avec consentement', async () => {
    // Je fournis une fonction factice que le composant appellera via useGoogleLogin.
    const loginFn = jest.fn();
    useGoogleLogin.mockReturnValue(loginFn);

    render(<Header />);

    // 1) Je vois le bouton “Se connecter”
    const connectBtn = screen.getByRole('button', { name: /se connecter/i });
    expect(connectBtn).toBeInTheDocument();

    // 2) Je clique → le dialog de connexion doit s’afficher
    fireEvent.click(connectBtn);
    expect(await screen.findByText(/Connexion Google/i)).toBeInTheDocument();

    // 3) Je coche la case de consentement RGPD
    const checkbox = screen.getByLabelText(/j’accepte l’utilisation de mes données/i);
    fireEvent.click(checkbox);

    // 4) Je clique sur “Continuer avec Google” → le hook de login doit être invoqué
    const continueBtn = screen.getByRole('button', { name: /continuer avec google/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(loginFn).toHaveBeenCalledTimes(1);
    });
  });

  it('affiche l’avatar quand l’utilisateur est connecté et déclenche le logout', async () => {
    // Je simule un utilisateur authentifié en localStorage.
    localStorage.setItem(
      'user',
      JSON.stringify({
        picture: 'https://mocked/avatar.jpg',
        email: 'test@example.com',
        id: '1',
      })
    );

    render(<Header />);

    // 1) Je vérifie que l’avatar apparait (l’utilisateur est reconnu)
    const avatar = await screen.findByRole('img', { name: /avatar/i });
    expect(avatar).toBeInTheDocument();

    // 2) Je clique sur l’avatar pour ouvrir le menu
    fireEvent.click(avatar);

    // 3) Je clique sur “Se déconnecter” → googleLogout doit être appelé
    const logoutBtn = await screen.findByRole('button', { name: /se déconnecter/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(googleLogout).toHaveBeenCalledTimes(1);
    });
  });
});
