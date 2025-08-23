// src/__tests__/InfoSection.test.jsx
// Je teste le composant InfoSection en simulant les appels réseau et le préchargement d’images.
// Objectif : vérifier le fallback visuel et l’utilisation correcte d’une photo fournie,
// ainsi que l’affichage des badges (jours, budget, voyageurs).
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import InfoSection from '~/view-trip/components/InfoSection';

// Je mocke les APIs réseau utilisées par le composant (photo directe + recherche Places).
jest.mock('~/service/api', () => ({ GetPlacePhoto: jest.fn() }));
jest.mock('~/service/GlobalApi', () => ({ GetPlaceDetails: jest.fn() }));

import { GetPlacePhoto } from '~/service/api';
import { GetPlaceDetails } from '~/service/GlobalApi';

// Je remplace global.Image pour que preload() résolve immédiatement en test.
// Ça me permet d’éviter l’aléa réseau et de rendre les tests déterministes.
const OriginalImage = global.Image;
beforeAll(() => {
  global.Image = class MockImage {
    set onload(fn) { this._onload = fn; }
    set onerror(fn) { this._onerror = fn; }
    set src(_) {
      // Je déclenche onload de façon asynchrone pour mimer un chargement réussi.
      setTimeout(() => this._onload && this._onload(), 0);
    }
  };
});
afterAll(() => {
  global.Image = OriginalImage;
});

describe('InfoSection', () => {
  // Je repars d’un état propre pour chaque test.
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('affiche le fallback quand aucune photo dispo', async () => {
    // Je force les mocks à ne rien renvoyer d’exploitable.
    GetPlacePhoto.mockResolvedValue(null);
    GetPlaceDetails.mockResolvedValue({ data: { places: [] } });

    render(<InfoSection name="Lyon" />);

    // Je cible l’image par son alt (dérivé du label) et je vérifie le placeholder.
    const img = await screen.findByRole('img', { name: /lyon/i });
    await waitFor(() =>
      expect(img).toHaveAttribute('src', expect.stringContaining('/placeholder.png'))
    );
  });

  test('utilise la photo renvoyée par GetPlacePhoto et affiche les badges', async () => {
    // Je fournis une URL valide côté GetPlacePhoto et je neutralise GetPlaceDetails.
    GetPlacePhoto.mockResolvedValue('https://img.test/ok.jpg');
    GetPlaceDetails.mockResolvedValue({ data: { places: [] } });

    render(
      <InfoSection
        placeId="place_123"
        trip={{
          userSelection: {
            location: { label: 'Paris' },
            noOfDays: '3',
            budget: 'Budget Test',
            traveler: 'Solo',
          },
        }}
      />
    );

    // Je vérifie que l’image chargée est bien celle renvoyée par le mock.
    const img = await screen.findByRole('img', { name: /paris/i });
    await waitFor(() => expect(img).toHaveAttribute('src', 'https://img.test/ok.jpg'));

    // Je vérifie aussi la présence des badges d’infos du trip.
    expect(screen.getByText(/3\s*jours/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget\s*:\s*Budget Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Voyageurs\s*:\s*Solo/i)).toBeInTheDocument();
  });
});
