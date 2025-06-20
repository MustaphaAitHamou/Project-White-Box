/* eslint-env jest,node */
/* global jest, describe, it, expect */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InfoSection from '../view-trip/components/InfoSection';
import * as api from '../service/GlobalApi';

// Mock de l’API GlobalApi
jest.mock('../service/GlobalApi');

describe('InfoSection', () => {
  it('affiche un loader si userSelection est manquant', () => {
    render(
      <MemoryRouter>
        <InfoSection trip={{}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Chargement des infos…/i)).toBeInTheDocument();
  });

  it('affiche une image quand GetPlaceDetails renvoie une photo', async () => {
    // On simule que l'API renvoie une liste de places avec une photo
    api.GetPlaceDetails.mockResolvedValueOnce({
      data: { places: [{ photos: [{ name: 'places/XX/photos/ref' }] }] }
    });

    const trip = {
      userSelection: {
        location: { label: 'Berlin' },
        noOfDays: 2,
        budget: 'Bon marché',
        traveler: '1 Personne'
      }
    };

    render(
      <MemoryRouter>
        <InfoSection trip={trip} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const img = screen.getByAltText(/Photo de Berlin/i);
      expect(img).toBeInTheDocument();
      expect(img.src).toContain('maps.googleapis.com/maps/api/place/photo');
    });
  });
});
