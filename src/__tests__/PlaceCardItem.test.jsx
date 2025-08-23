/* eslint-env jest, browser */
/**
 * Tests de PlaceCardItem.
 * Je vérifie deux comportements clés :
 *  1) quand l’API renvoie un `photos[0].name`, je construis bien l’URL v1 Google Places
 *     et je l’applique à l’image ;
 *  2) quand aucune photo n’est disponible, je garde le placeholder.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PlaceCardItem from '~/view-trip/components/PlaceCardItem';

// Le composant lit la clé via getEnv : je renvoie une valeur factice contrôlée.
jest.mock('~/lib/meta-env', () => ({ getEnv: () => 'fake-key' }));

// Je mocke la recherche textuelle Places pour piloter la réponse côté test.
jest.mock('~/service/GlobalApi', () => ({ GetPlaceDetails: jest.fn() }));
import { GetPlaceDetails } from '~/service/GlobalApi';

// Je remets les espions à zéro après chaque test pour éviter les fuites d’état.
afterEach(() => jest.clearAllMocks());

// Props minimales communes aux tests.
const PROPS = {
  placeName: 'Tour Eiffel',
  details: 'Un monument de Paris',
  timeToTravel: '15 min',
  destinationLabel: 'Paris',
};

test('affiche la photo quand l’API renvoie un photo.name', async () => {
  // Je fournis un premier résultat Places contenant un nom de photo exploitable.
  GetPlaceDetails.mockResolvedValue({
    data: {
      places: [
        {
          photos: [{ name: 'places/xxx/photos/abc' }],
          location: { latitude: 48.8584, longitude: 2.2945 },
        },
      ],
    },
  });

  render(<PlaceCardItem {...PROPS} />);

  // Je cible l’image via son alt (égale au placeName).
  const img = screen.getByRole('img', { name: /tour eiffel/i });

  // Je m’assure que la source correspond bien au format v1 attendu.
  await waitFor(() => {
    expect(img.getAttribute('src') || '').toMatch(
      /https:\/\/places\.googleapis\.com\/v1\/places\/xxx\/photos\/abc\/media\?/
    );
  });
});

test("fallback: pas de photo -> l'image reste le placeholder", async () => {
  // Cette fois, je renvoie un résultat sans photos pour déclencher le fallback.
  GetPlaceDetails.mockResolvedValue({
    data: { places: [{ photos: [] }] },
  });

  render(<PlaceCardItem {...PROPS} />);

  const img = screen.getByRole('img', { name: /tour eiffel/i });

  // Je vérifie que la source reste sur le placeholder prévu par le composant.
  await waitFor(() => {
    expect(img).toHaveAttribute('src', '/placeholder.png');
  });
});
