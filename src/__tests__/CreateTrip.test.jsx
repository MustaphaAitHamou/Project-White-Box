/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
/* 
  Tests d’intégration rapides du flux CreateTrip.
  Je couvre trois cas :
    - utilisateur déjà connecté mais formulaire vide → toast d’erreur ;
    - même scénario en variante courte ;
    - “happy path” complet : saisie, consentement, login Google mocké,
      génération du plan, écriture Firestore et navigation finale.
*/
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateTrip from "~/create-trip";

// ---- Mocks stables (une seule fois) ----
// Je fige les options pour rendre les tests déterministes.
jest.mock("~/constants/options", () => ({
  AI_PROMPT:
    "Trip in {location} for {totalDays} days with {traveler} on {budget}",
  SelectBudgetOptions: [{ id: 1, title: "Budget Test", icon: "$" }],
  SelectTravelesList: [{ id: 1, title: "Solo", people: "1", icon: "👤" }],
}));

// Footer mock (nommé + displayName)
// Je remplace le footer réel par un composant minimal pour éviter les effets de style/DOM.
jest.mock("~/view-trip/components/Footer", () => {
  const React = require("react");
  function MockFooter() {
    return React.createElement("div", { "data-testid": "footer" });
  }
  MockFooter.displayName = "MockFooter";
  return { __esModule: true, default: MockFooter };
});

// react-google-places-autocomplete mock (nommé + displayName + propTypes)
// Je simule un bouton qui injecte directement une valeur “Paris, France”.
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

// J’uniformise l’accès à la clé Places via le helper mocké.
jest.mock("~/lib/meta-env", () => ({ getEnv: () => "fake-key" }));

// Je stubbe les toasts pour pouvoir vérifier les appels sans afficher d’UI.
jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn(), info: jest.fn() },
}));
import { toast } from "sonner";

// Je mocke axios pour contrôler la réponse du profil Google.
jest.mock("axios");
import axios from "axios";

// Je remplace l’appel IA par une promesse résolue et traçable.
jest.mock("~/service/AIModal", () => ({
  generateTripPlan: jest.fn(() => Promise.resolve({ plan: "ok" })),
}));
import { generateTripPlan } from "~/service/AIModal";

// Je remplace Firestore : setDoc/doc retournent des doubles inoffensifs.
jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(() => Promise.resolve()),
  doc: jest.fn((db, col, id) => ({ db, col, id })),
}));
import { setDoc } from "firebase/firestore";

// Je fournis un db vide pour satisfaire les imports.
jest.mock("~/service/firebaseConfig", () => ({ db: {} }));

// Je capte useNavigate pour vérifier la navigation programmée.
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// Je mocke le hook de login Google pour déclencher onSuccess à la demande.
jest.mock("@react-oauth/google", () => ({ useGoogleLogin: jest.fn() }));
import { useGoogleLogin } from "@react-oauth/google";

describe("CreateTrip – tests fusionnés (flow + vérifs rapides)", () => {
  // Je repars d’un état propre avant chaque test.
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("affiche une erreur si le formulaire est vide (utilisateur déjà authentifié)", () => {
    // Je simule un utilisateur connecté (ce qui évite l’ouverture du dialog).
    localStorage.setItem(
      "user",
      JSON.stringify({ email: "u@test.tld", id: "u1" })
    );

    render(
      <MemoryRouter>
        <CreateTrip />
      </MemoryRouter>
    );

    // Sans remplir le formulaire, je clique sur “Générer”.
    fireEvent.click(screen.getByRole("button", { name: /générer/i }));

    // Je m’attends à un toast d’erreur…
    expect(toast.error).toHaveBeenCalledWith(
      "Veuillez remplir tous les champs"
    );
    // …et surtout pas au dialog Google.
    expect(screen.queryByText(/connexion google/i)).not.toBeInTheDocument();
  });

  test("affiche un toast d’erreur si on génère sans champs requis (variante courte)", () => {
    // Même idée, en plus concis.
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
    // Je fixe Date.now pour que l’ID généré soit prédictible.
    const dateSpy = jest.spyOn(Date, "now").mockReturnValue(12345);

    // Je fais en sorte que le hook exécute immédiatement onSuccess avec un token factice.
    useGoogleLogin.mockImplementation((opts) => () =>
      opts.onSuccess({ access_token: "token-123" })
    );

    // Je simule la réponse Google UserInfo.
    axios.get.mockResolvedValue({
      data: { email: "u@test.tld", id: "uid-1" },
    });

    render(
      <MemoryRouter>
        <CreateTrip />
      </MemoryRouter>
    );

    // 1) Je remplis le formulaire : destination, jours, budget, voyageurs.
    fireEvent.click(screen.getByTestId("mock-places")); // Destination -> Paris

    const daysInput = screen.getByLabelText(/nombre de jours/i);
    fireEvent.change(daysInput, { target: { value: "3" } });

    // Je sélectionne Budget et Voyageurs (les libellés incluent parfois des icônes).
    fireEvent.click(screen.getByRole("button", { name: /budget test/i }));
    fireEvent.click(screen.getByRole("button", { name: /solo/i }));

    // 2) Je clique sur Générer → j’attends l’ouverture du dialog (pas d’utilisateur stocké au départ).
    fireEvent.click(screen.getByRole("button", { name: /générer/i }));
    expect(await screen.findByText(/connexion google/i)).toBeInTheDocument();

    // 3) Sans consentement, je m’attends à un message d’erreur.
    fireEvent.click(
      screen.getByRole("button", { name: /continuer avec google/i })
    );
    expect(
      await screen.findByText(/merci d’accepter les conditions/i)
    ).toBeInTheDocument();

    // 4) Je coche la case, je relance → login mocké, génération, navigation.
    fireEvent.click(screen.getByRole("checkbox", { name: /j.?accepte/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /continuer avec google/i })
    );

    await waitFor(() => {
      expect(generateTripPlan).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/view-trip/12345");
    });

    // Je vérifie les écritures Firestore : consentement + trip sauvegardé.
    expect(setDoc).toHaveBeenCalledTimes(2);
    const [consentCall, tripCall] = setDoc.mock.calls;
    expect(consentCall[0].col).toBe("consents");
    expect(tripCall[0].col).toBe("AITrips");

    // Je restaure Date.now.
    dateSpy.mockRestore();
  });
});
