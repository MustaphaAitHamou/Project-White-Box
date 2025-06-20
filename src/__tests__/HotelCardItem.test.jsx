// src/__tests__/HotelCardItem.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HotelCardItem from '../view-trip/components/HotelCardItem';
import * as api from '../service/GlobalApi';

jest.mock('../service/GlobalApi');

describe('HotelCardItem', () => {
  it('construit bien l’URL de la photo et l’affiche', async () => {
    const fakePhotoRef = 'ABC123';
    api.GetPlaceDetails.mockResolvedValueOnce({
      data: { places: [{ photos: [{ name: `places/XX/photos/${fakePhotoRef}` }] }] }
    });

    render(
      <MemoryRouter>
        <HotelCardItem
          hotel={{
            hotelName: 'Test Hotel',
            hotelAddress: '123 Rue Fictive',
            price: '$50',
            rating: '4.0 Stars'
          }}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      const img = screen.getByAltText('Test Hotel');
      expect(img).toBeInTheDocument();
      // On vérifie que la photo utilise bien la référence encodée
      expect(img.src).toContain(encodeURIComponent(fakePhotoRef));
    });
  });

  it('affiche le placeholder si l’API échoue', async () => {
    api.GetPlaceDetails.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <MemoryRouter>
        <HotelCardItem
          hotel={{
            hotelName: 'Test Hotel',
            hotelAddress: '123 Rue Fictive',
            price: '$50',
            rating: '4.0 Stars'
          }}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      const img = screen.getByAltText('Test Hotel');
      expect(img.src).toContain('/placeholder.png');
    });
  });
});
