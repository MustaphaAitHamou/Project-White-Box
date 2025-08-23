import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Hero from '~/components/custom/Hero';

describe('🧩 Hero', () => {
  it('affiche le titre et le bouton', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    expect(screen.getByText(/Explorez l’inconnu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer un voyage/i })).toBeInTheDocument();
  });
});
