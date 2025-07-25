/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import HotelCardItem from '~/view-trip/components/HotelCardItem';

jest.mock('~/service/GlobalApi', () => ({
  GetPlaceDetails: jest.fn().mockResolvedValue({
    data: {
      places: [{
        photos: [{ name: 'phoToABC' }],
        location: { latitude: 1, longitude: 2 },
      }],
    },
  }),
}));

test('HotelCardItem affiche infos et photo', async () => {
  render(
    <HotelCardItem
      hotel={{
        hotelName: 'Hotel Test',
        hotelAddress: '1 rue test',
        price: '€ 100',
        rating: 4.5,
      }}
    />
  );

  expect(screen.getByText(/hotel test/i)).toBeInTheDocument();
  expect(screen.getByText(/€ 100/)).toBeInTheDocument();

  const img = await screen.findByRole('img', { name: /hotel test/i });
  expect(img.src).toContain('phoToABC');
});
