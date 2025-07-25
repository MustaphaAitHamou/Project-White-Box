/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import Header from '@/components/custom/Header.jsx';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

// réinitialisation automatique du localStorage avant chaque test
beforeEach(() => {
  try { localStorage.clear(); } catch {}
  jest.clearAllMocks();
});

describe('🔐 Header', () => {
  it('affiche le bouton "Connexion", ouvre le dialog et déclenche le login avec consentement', async () => {
    const loginFn = jest.fn();
    useGoogleLogin.mockReturnValue(loginFn);

    render(<Header />);

    // 1) Bouton Connexion visible
    const connectBtn = screen.getByRole('button', { name: /connexion/i });
    expect(connectBtn).toBeInTheDocument();

    // 2) Clique -> dialog ouvert
    fireEvent.click(connectBtn);
    expect(await screen.findByText(/Connexion Google/i)).toBeInTheDocument();

    // 3) Consentement
    const checkbox = screen.getByLabelText(/j’accepte l’utilisation de mes données/i);
    fireEvent.click(checkbox);

    // 4) Clic sur "Continuer avec Google" -> loginFn appelé
    const continueBtn = screen.getByRole('button', { name: /continuer avec google/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(loginFn).toHaveBeenCalledTimes(1);
    });
  });

  it('affiche l’avatar quand l’utilisateur est connecté et déclenche le logout', async () => {
    // Simule un utilisateur existant
    localStorage.setItem('user', JSON.stringify({
      picture: 'https://mocked/avatar.jpg',
      email  : 'test@example.com',
      id     : '1',
    }));

    render(<Header />);

    // avatar affiché
    const avatar = await screen.findByRole('img', { name: /avatar/i });
    expect(avatar).toBeInTheDocument();

    // Ouvre le popover (clic sur l'image)
    fireEvent.click(avatar);

    // bouton "Se déconnecter"
    const logoutBtn = await screen.findByRole('button', { name: /se déconnecter/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(googleLogout).toHaveBeenCalledTimes(1);
    });
  });
});
