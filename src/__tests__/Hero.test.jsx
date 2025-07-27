import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Hero from '~/components/custom/Hero';

// Mock des effets visuels
jest.mock('~/components/fx/SparklesCore', () => {
  const MockSparklesCore = () => <div data-testid="sparkles-core" />;
  MockSparklesCore.displayName = 'MockSparklesCore';
  return MockSparklesCore;
});
jest.mock('~/components/fx/BackgroundBeams', () => {
  const MockBackgroundBeams = () => <div data-testid="background-beams" />;
  MockBackgroundBeams.displayName = 'MockBackgroundBeams';
  return MockBackgroundBeams;
});

describe('🧩 Hero', () => {
  it('affiche le titre et le bouton', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    expect(screen.getByText(/Explorez l’inconnu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer un voyage/i })).toBeInTheDocument();
    expect(screen.getByTestId('sparkles-core')).toBeInTheDocument();
    expect(screen.getByTestId('background-beams')).toBeInTheDocument();
  });
});
