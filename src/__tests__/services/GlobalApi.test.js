/* eslint-env jest,node */
/* global process, jest, describe, it, expect, beforeEach */

import axios from 'axios';
import { GetPlaceDetails } from '../../service/GlobalApi';

jest.mock('axios');            // on mocke TOUT axios

describe('GlobalApi', () => {
  const mockData = { textQuery: 'Eiffel Tower' };

  beforeEach(() => {
    axios.post.mockClear();    // reset entre les tests
    process.env.VITE_GOOGLE_PLACE_API_KEY = 'test-key';
  });

  it('envoie une requête POST à la bonne URL avec les bons headers', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    await GetPlaceDetails(mockData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('places:searchText'),
      mockData,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': expect.any(String),
          'X-Goog-FieldMask': expect.stringContaining('places.')
        })
      })
    );
  });
});
