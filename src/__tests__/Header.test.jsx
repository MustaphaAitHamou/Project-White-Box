/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '@/components/custom/Header.jsx';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

// Mock obligatoire : sinon import.meta.env plante
beforeAll(() => {
  global.window = Object.create(window);
  window.__ENV__ = { VITE_RECAPTCHA_SITE_KEY: 'fake-key' };
});

jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(),
  googleLogout: jest.fn(),
}));

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
    const loginFn = jest.fn();
    useGoogleLogin.mockReturnValue(loginFn);

    render(<Header />);

    const connectBtn = screen.getByRole('button', { name: /se connecter/i });
    expect(connectBtn).toBeInTheDocument();

    fireEvent.click(connectBtn);
    expect(await screen.findByText(/Connexion Google/i)).toBeInTheDocument();

    const checkbox = screen.getByLabelText(/j’accepte l’utilisation de mes données/i);
    fireEvent.click(checkbox);

    const continueBtn = screen.getByRole('button', { name: /continuer avec google/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(loginFn).toHaveBeenCalledTimes(1);
    });
  });

  it('affiche l’avatar quand l’utilisateur est connecté et déclenche le logout', async () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        picture: 'https://mocked/avatar.jpg',
        email: 'test@example.com',
        id: '1',
      })
    );

    render(<Header />);

    const avatar = await screen.findByRole('img', { name: /avatar/i });
    expect(avatar).toBeInTheDocument();

    fireEvent.click(avatar);

    const logoutBtn = await screen.findByRole('button', { name: /se déconnecter/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(googleLogout).toHaveBeenCalledTimes(1);
    });
  });
});
