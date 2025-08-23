// Test d’interface pour le composant Hero.
// Je rends le composant dans un MemoryRouter car Hero contient un <Link>
// et j’affirme simplement la présence du titre et du bouton d’appel à l’action.

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Hero from '~/components/custom/Hero';

describe('🧩 Hero', () => {
  it('affiche le titre et le bouton', () => {
    // Je monte Hero dans un routeur mémoire pour satisfaire les liens internes.
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    // Je vérifie que le titre marketing est visible.
    expect(screen.getByText(/Explorez l’inconnu/i)).toBeInTheDocument();
    // Je vérifie la présence du bouton principal qui mène vers la création de voyage.
    expect(screen.getByRole('button', { name: /Créer un voyage/i })).toBeInTheDocument();
  });
});
