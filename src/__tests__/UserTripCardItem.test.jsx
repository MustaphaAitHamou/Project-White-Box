  /* eslint-env jest, browser */
  import React from "react";
  import { render, screen, waitFor } from "@testing-library/react";
  import { MemoryRouter } from "react-router-dom";

  // Mocks
  jest.mock("~/lib/meta-env", () => ({ getEnv: () => "fake-key" }));
  jest.mock("~/service/GlobalApi", () => ({ GetPlaceDetails: jest.fn() }));
  import { GetPlaceDetails } from "~/service/GlobalApi";

  import UserTripCardItem from "~/my-trips/components/UserTripCardItem";

  const TRIP = {
    id: "t1",
    userSelection: {
      location: { label: "Paris, France" },
      noOfDays: "3",
      budget: "Budget Test",
    },
  };

  test("rend le lien, le texte et récupère la photo via Places", async () => {
    GetPlaceDetails.mockResolvedValue({
      data: { places: [{ photos: [{ name: "places/123/photos/abc" }] }] },
    });

    render(
      <MemoryRouter>
        <UserTripCardItem trip={TRIP} />
      </MemoryRouter>
    );

    // Lien
    expect(screen.getByRole("link")).toHaveAttribute("href", "/view-trip/t1");

    // Textes
    expect(
      screen.getByRole("heading", { name: /paris, france/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/3 jours/i)).toBeInTheDocument();
    expect(screen.getByText(/budget\s*:?\s*budget test/i)).toBeInTheDocument();

    // Image -> URL construite avec la clé mockée
    const img = screen.getByRole("img", { name: /paris, france/i });
    await waitFor(() =>
      expect(img).toHaveAttribute(
        "src",
        "https://places.googleapis.com/v1/places/123/photos/abc/media?maxHeightPx=1000&maxWidthPx=1000&key=fake-key"
      )
    );
  });
