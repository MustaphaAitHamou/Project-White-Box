/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateTrip from "~/create-trip";

// ---- Mocks stables (une seule fois) ----
jest.mock("~/constants/options", () => ({
  AI_PROMPT:
    "Trip in {location} for {totalDays} days with {traveler} on {budget}",
  SelectBudgetOptions: [{ id: 1, title: "Budget Test", icon: "$" }],
  SelectTravelesList: [{ id: 1, title: "Solo", people: "1", icon: "👤" }],
}));

// Footer mock (nommé + displayName)
jest.mock("~/view-trip/components/Footer", () => {
  const React = require("react");
  function MockFooter() {
    return React.createElement("div", { "data-testid": "footer" });
  }
  MockFooter.displayName = "MockFooter";
  return { __esModule: true, default: MockFooter };
});

// react-google-places-autocomplete mock (nommé + displayName + propTypes)
jest.mock("react-google-places-autocomplete", () => {
  const React = require("react");
  const PropTypes = require("prop-types");

  function MockGooglePlaces({ selectProps }) {
    return React.createElement(
      "button",
      {
        type: "button",
        "data-testid": "mock-places",
        onClick: () =>
          selectProps.onChange({
            label: "Paris, France",
            value: { place_id: "p1" },
          }),
      },
      "Choisir Paris"
    );
  }
  MockGooglePlaces.displayName = "MockGooglePlacesAutocomplete";
  MockGooglePlaces.propTypes = {
    selectProps: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
    }).isRequired,
  };

  return { __esModule: true, default: MockGooglePlaces };
});

jest.mock("~/lib/meta-env", () => ({ getEnv: () => "fake-key" }));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn(), info: jest.fn() },
}));
import { toast } from "sonner";

jest.mock("axios");
import axios from "axios";

jest.mock("~/service/AIModal", () => ({
  generateTripPlan: jest.fn(() => Promise.resolve({ plan: "ok" })),
}));
import { generateTripPlan } from "~/service/AIModal";

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(() => Promise.resolve()),
  doc: jest.fn((db, col, id) => ({ db, col, id })),
}));
import { setDoc } from "firebase/firestore";

jest.mock("~/service/firebaseConfig", () => ({ db: {} }));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

jest.mock("@react-oauth/google", () => ({ useGoogleLogin: jest.fn() }));
import { useGoogleLogin } from "@react-oauth/google";

describe("CreateTrip – tests fusionnés (flow + vérifs rapides)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("affiche une erreur si le formulaire est vide (utilisateur déjà authentifié)", () => {
    // Simule un user déjà connecté pour passer la barrière d'auth
    localStorage.setItem(
      "user",
      JSON.stringify({ email: "u@test.tld", id: "u1" })
    );

    render(
      <MemoryRouter>
        <CreateTrip />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /générer/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "Veuillez remplir tous les champs"
    );
    // Et surtout pas de dialog d'auth qui s'ouvre
    expect(screen.queryByText(/connexion google/i)).not.toBeInTheDocument();
  });

  test("affiche un toast d’erreur si on génère sans champs requis (variante courte)", () => {
    localStorage.setItem("user", JSON.stringify({ email: "u@test.io" }));

    render(
      <MemoryRouter>
        <CreateTrip />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /générer/i }));
    expect(toast.error).toHaveBeenCalledWith(
      "Veuillez remplir tous les champs"
    );
  });

  test("happy path : choix + consentement + login + génération + navigation", async () => {
    const dateSpy = jest.spyOn(Date, "now").mockReturnValue(12345);

    useGoogleLogin.mockImplementation((opts) => () =>
      opts.onSuccess({ access_token: "token-123" })
    );

    axios.get.mockResolvedValue({
      data: { email: "u@test.tld", id: "uid-1" },
    });

    render(
      <MemoryRouter>
        <CreateTrip />
      </MemoryRouter>
    );

    // 1) Remplir le formulaire
    fireEvent.click(screen.getByTestId("mock-places")); // Destination -> Paris

    const daysInput = screen.getByLabelText(/nombre de jours/i);
    fireEvent.change(daysInput, { target: { value: "3" } });

    // Les noms accessibles incluent souvent l’icône, on cible par regex
    fireEvent.click(screen.getByRole("button", { name: /budget test/i }));
    fireEvent.click(screen.getByRole("button", { name: /solo/i }));

    // 2) Cliquer Générer => ouverture du dialog (pas d'utilisateur en localStorage)
    fireEvent.click(screen.getByRole("button", { name: /générer/i }));
    expect(await screen.findByText(/connexion google/i)).toBeInTheDocument();

    // 3) Cliquer sans consentement => erreur
    fireEvent.click(
      screen.getByRole("button", { name: /continuer avec google/i })
    );
    expect(
      await screen.findByText(/merci d’accepter les conditions/i)
    ).toBeInTheDocument();

    // 4) Consentement + login → génération + navigation
    fireEvent.click(screen.getByRole("checkbox", { name: /j.?accepte/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /continuer avec google/i })
    );

    await waitFor(() => {
      expect(generateTripPlan).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/view-trip/12345");
    });

    // Firebase : 1 écriture consentement + 1 écriture trip
    expect(setDoc).toHaveBeenCalledTimes(2);
    const [consentCall, tripCall] = setDoc.mock.calls;
    expect(consentCall[0].col).toBe("consents");
    expect(tripCall[0].col).toBe("AITrips");

    dateSpy.mockRestore();
  });
});
