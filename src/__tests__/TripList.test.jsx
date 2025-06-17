import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyTrips from 'my-trips';

describe('MyTrips', () => {
  it('affiche un message si aucun voyage trouvé', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));

    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );

    expect(screen.getByText(/Aucun voyage trouvé/i)).toBeInTheDocument();
  });
});
