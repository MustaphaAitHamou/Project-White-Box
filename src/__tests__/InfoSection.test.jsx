// src/__tests__/InfoSection.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import InfoSection from '~/view-trip/components/InfoSection';

// Mocks des APIs réseau
jest.mock('~/service/api', () => ({ GetPlacePhoto: jest.fn() }));
jest.mock('~/service/GlobalApi', () => ({ GetPlaceDetails: jest.fn() }));

import { GetPlacePhoto } from '~/service/api';
import { GetPlaceDetails } from '~/service/GlobalApi';

// Mock <Image> pour que preload() résolve immédiatement
const OriginalImage = global.Image;
beforeAll(() => {
  global.Image = class MockImage {
    set onload(fn) { this._onload = fn; }
    set onerror(fn) { this._onerror = fn; }
    set src(_) {
      // déclenche onload de façon asynchrone
      setTimeout(() => this._onload && this._onload(), 0);
    }
  };
});
afterAll(() => {
  global.Image = OriginalImage;
});

describe('InfoSection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('affiche le fallback quand aucune photo dispo', async () => {
    GetPlacePhoto.mockResolvedValue(null);
    GetPlaceDetails.mockResolvedValue({ data: { places: [] } });

    render(<InfoSection name="Lyon" />);

    const img = await screen.findByRole('img', { name: /lyon/i });
    await waitFor(() =>
      expect(img).toHaveAttribute('src', expect.stringContaining('/placeholder.png'))
    );
  });

  test('utilise la photo renvoyée par GetPlacePhoto et affiche les badges', async () => {
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

    const img = await screen.findByRole('img', { name: /paris/i });
    await waitFor(() => expect(img).toHaveAttribute('src', 'https://img.test/ok.jpg'));

    expect(screen.getByText(/3\s*jours/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget\s*:\s*Budget Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Voyageurs\s*:\s*Solo/i)).toBeInTheDocument();
  });
});
