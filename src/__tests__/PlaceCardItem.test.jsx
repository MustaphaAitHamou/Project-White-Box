/* eslint-env jest, browser */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PlaceCardItem from '~/view-trip/components/PlaceCardItem';

// the component reads the key via getEnv
jest.mock('~/lib/meta-env', () => ({ getEnv: () => 'fake-key' }));

// mock the Places text search
jest.mock('~/service/GlobalApi', () => ({ GetPlaceDetails: jest.fn() }));
import { GetPlaceDetails } from '~/service/GlobalApi';

afterEach(() => jest.clearAllMocks());

const PROPS = {
  placeName: 'Tour Eiffel',
  details: 'Un monument de Paris',
  timeToTravel: '15 min',
  destinationLabel: 'Paris',
};

test('affiche la photo quand l’API renvoie un photo.name', async () => {
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

  // cible l'image par son alt (= placeName)
  const img = screen.getByRole('img', { name: /tour eiffel/i });

  await waitFor(() => {
    // URL v1 générée par le composant
    expect(img.getAttribute('src') || '').toMatch(
      /https:\/\/places\.googleapis\.com\/v1\/places\/xxx\/photos\/abc\/media\?/
    );
  });
});

test("fallback: pas de photo -> l'image reste le placeholder", async () => {
  GetPlaceDetails.mockResolvedValue({
    data: { places: [{ photos: [] }] },
  });

  render(<PlaceCardItem {...PROPS} />);

  const img = screen.getByRole('img', { name: /tour eiffel/i });

  // l'effet tourne puis ne trouve pas de photo => placeholder conservé
  await waitFor(() => {
    expect(img).toHaveAttribute('src', '/placeholder.png');
  });
});
