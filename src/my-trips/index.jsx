 
 
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import MyTrips from '../my-trips/'; // ajuste si différent

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ✅ Corriger l'import selon ton arborescence réelle

// Mock Firebase Firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
  };
});

import { getDocs } from 'firebase/firestore';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock localStorage
beforeEach(() => {
  localStorage.setItem(
    'user',
    JSON.stringify({ email: 'test@example.com' })
  );
});

describe('🧳 MyTrips', () => {
  it('affiche un message si aucun voyage trouvé', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });

    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );

    expect(await screen.findByText(/aucun voyage trouvé/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer un nouveau voyage/i })).toBeInTheDocument();
  });

  it('affiche un voyage s’il est trouvé dans Firestore', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: 'trip42',
          data: () => ({
            userSelection: {
              location: { label: 'Berlin' },
              noOfDays: 3,
              budget: 'Bon marché',
              travelCompanion: 'Solo',
            },
          }),
        },
      ],
    });

    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Berlin/i)).toBeInTheDocument();
    expect(screen.getByText(/3 jours/i)).toBeInTheDocument();
    expect(screen.getByText(/Bon marché/i)).toBeInTheDocument();
    expect(screen.getByText(/Solo/i)).toBeInTheDocument();
  });

  it('redirige vers le voyage au clic', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: 'trip42',
          data: () => ({
            userSelection: {
              location: { label: 'Berlin' },
              noOfDays: 2,
              budget: 'Moyen',
              travelCompanion: 'Solo',
            },
          }),
        },
      ],
    });

    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );

    const card = await screen.findByText((text) => text.includes('Berlin'));
    expect(card.closest('a')).toHaveAttribute('href', '/view-trip/trip42');
  });
});
