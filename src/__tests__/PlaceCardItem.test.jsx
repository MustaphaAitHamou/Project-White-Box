/* eslint-env jest */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PlaceCardItem from '~/view-trip/components/PlaceCardItem';

jest.mock('~/service/GlobalApi', () => ({
  GetPlaceDetails: jest.fn().mockResolvedValue({
    data: {
      places: [{
        photos: [{ name: 'phoTo987' }],
        location: { latitude: 10, longitude: 20 },
      }],
    },
  }),
}));

test('PlaceCardItem affiche placeName et charge photo', async () => {
  render(
    <PlaceCardItem
      placeName="Tour Eiffel"
      details="Belle tour"
      timeToTravel="15 min"
      slotLabel="Morning"
      destinationLabel="Paris"
    />
  );
  expect(screen.getByText(/tour eiffel/i)).toBeInTheDocument();
  const img = await screen.findByRole('img', { name: /tour eiffel/i });
  expect(img.src).toContain('phoTo987');
  expect(screen.getByText(/15 min/)).toBeInTheDocument();
});
