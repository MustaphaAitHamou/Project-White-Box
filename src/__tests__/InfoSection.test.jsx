/* eslint-env jest */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import InfoSection from '../view-trip/components/InfoSection';

jest.mock('~/service/api', () => ({
  GetPlacePhoto: jest.fn().mockResolvedValue('https://mocked.com/foo.jpg'),
}));

test('InfoSection charge et affiche la photo', async () => {
  render(<InfoSection placeId="foo" name="Paris" />);
  await waitFor(() =>
    expect(screen.getByAltText(/photo de paris/i)).toHaveAttribute('src', 'https://mocked.com/foo.jpg')
  );
});
