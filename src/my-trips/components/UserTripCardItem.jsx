import { render, screen } from '@testing-library/react';

describe('🧳 UserTripCardItem', () => {
  it('affiche les informations du voyage (label, jours, budget)', () => {
    const tripMock = {
      id: 'trip123',
      userSelection: {
        location: { label: 'Berlin' },
        noOfDays: 4,
        budget: 'Modéré',
      },
    };

    render(
      <MemoryRouter>
        <UserTripCardItem trip={tripMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText(/4 jours/i)).toBeInTheDocument();
    expect(screen.getByText(/Modéré/i)).toBeInTheDocument();
  });

  it('redirige vers la bonne URL', () => {
    const tripMock = {
      id: 'trip456',
      userSelection: {
        location: { label: 'Tokyo' },
        noOfDays: 7,
        budget: 'Luxe',
      },
    };

    render(
      <MemoryRouter>
        <UserTripCardItem trip={tripMock} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /Tokyo/i });
    expect(link).toHaveAttribute('href', '/view-trip/trip456');
  });

  it('affiche "Voyage" si aucun label n’est fourni', () => {
    const tripMock = {
      id: 'trip789',
      userSelection: {
        location: { label: '' }, // vide
        noOfDays: 2,
        budget: 'Économique',
      },
    };

    render(
      <MemoryRouter>
        <UserTripCardItem trip={tripMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('Voyage')).toBeInTheDocument();
  });
});
