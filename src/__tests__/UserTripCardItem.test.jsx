/* eslint-env jest, browser */
/**
 * Test d’interface pour UserTripCardItem.
 * Ici je vérifie trois choses :
 *  1) le lien pointe bien vers /view-trip/:id
 *  2) les textes (titre, nb de jours, budget) s’affichent
 *  3) l’image est construite à partir du photo.name renvoyé par Places
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Je fournis des valeurs d’env factices via le helper.
jest.mock("~/lib/meta-env", () => ({ getEnv: () => "fake-key" }));
// Je mocke la recherche textuelle Places pour piloter la réponse.
jest.mock("~/service/GlobalApi", () => ({ GetPlaceDetails: jest.fn() }));
import { GetPlaceDetails } from "~/service/GlobalApi";

import UserTripCardItem from "~/my-trips/components/UserTripCardItem";

// Données minimales d’un trip tel qu’utilisé par le composant.
const TRIP = {
  id: "t1",
  userSelection: {
    location: { label: "Paris, France" },
    noOfDays: "3",
    budget: "Budget Test",
  },
};

test("rend le lien, le texte et récupère la photo via Places", async () => {
  // Je renvoie un résultat Places contenant un photo.name exploitable.
  GetPlaceDetails.mockResolvedValue({
    data: { places: [{ photos: [{ name: "places/123/photos/abc" }] }] },
  });

  // Je rends le composant dans un Router mémoire pour activer les <Link>.
  render(
    <MemoryRouter>
      <UserTripCardItem trip={TRIP} />
    </MemoryRouter>
  );

  // Lien : je vérifie l’URL calculée à partir de l’id passé en props.
  expect(screen.getByRole("link")).toHaveAttribute("href", "/view-trip/t1");

  // Textes : je contrôle le titre et les badges d’infos.
  expect(
    screen.getByRole("heading", { name: /paris, france/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/3 jours/i)).toBeInTheDocument();
  expect(screen.getByText(/budget\s*:?\s*budget test/i)).toBeInTheDocument();

  // Image : je m’assure que la src correspond à l’URL v1 construite avec la clé mockée.
  const img = screen.getByRole("img", { name: /paris, france/i });
  await waitFor(() =>
    expect(img).toHaveAttribute(
      "src",
      "https://places.googleapis.com/v1/places/123/photos/abc/media?maxHeightPx=1000&maxWidthPx=1000&key=fake-key"
    )
  );
});
