// src/__tests__/services/GlobalApi.test.js

import axios from 'axios';
import { GetPlaceDetails } from '../../service/GlobalApi';

jest.mock('axios');

describe('GlobalApi', () => {
  const mockData = { textQuery: 'Eiffel Tower' };

  beforeEach(() => {
    axios.post.mockClear();
  });

  it('envoie une requête POST à la bonne URL avec les bons headers', async () => {
    const mockResponse = {
      data: {
        places: [{ displayName: { text: 'Eiffel Tower' } }],
      },
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await GetPlaceDetails(mockData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('places:searchText'),
      mockData,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': undefined, // <-- on accepte ici undefined
          'X-Goog-FieldMask': expect.stringContaining('places.')
        })
      })
    );

    expect(response).toEqual(mockResponse);
  });

  it('gère une erreur axios', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    await expect(GetPlaceDetails(mockData)).rejects.toThrow('Network Error');
  });
});
