/* src/setupTests.js */
/* eslint-env jest, node */
/* eslint-disable react/display-name, react/prop-types */

/**
 * Fichier d’amorçage Jest côté client.
 * Je prépare l’environnement JSDOM, j’ajoute quelques polyfills
 * et je pose les mocks indispensables pour tester l’UI sans dépendances externes.
 */

import React from "react";
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Je rends React global pour éviter des imports verbeux dans certains tests.
global.React = React;

// Polyfills utiles pour certains libs qui s’attendent à ces APIs en environnement Node.
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;
// JSDOM ne fournit pas toujours scrollTo ; je neutralise pour éviter des erreurs.
if (typeof window !== "undefined" && !window.scrollTo)
  window.scrollTo = () => {};

/**
 * Variables d’environnement simulées pour les tests.
 * Remarque importante : les affectations successives ci-dessous écrasent la précédente.
 * Je les laisse telles quelles pour coller à l’historique du projet ; au final, la dernière gagne.
 */
  globalThis.importMetaEnv = {
  VITE_GOOGLE_PLACE_API_KEY: 'mock-key',
  VITE_GOOGLE_GEMINI_AI_API_KEY: 'mock-gemini',
  VITE_GOOGLE_AUTH_CLIENT_ID: 'mock-client',
};

  globalThis.importMetaEnv = {
    VITE_GOOGLE_PLACE_API_KEY: 'mocked-key',
  };
  
// Dernière valeur retenue pour les tests.
globalThis.importMetaEnv = { VITE_GOOGLE_PLACE_API_KEY: "test-key" };

/* --------- Silence sélectif des erreurs console --------- */
/**
 * Je garde la console utilisable tout en filtrant un bruit attendu
 * pour des erreurs réseau simulées sur la récupération de photos.
 */
const origError = console.error;
console.error = (...args) => {
  const msg = String(args[0] ?? "");
  if (msg.includes("Photo fetch error")) return;
  origError(...args);
};

/* ─────────── MOCKS INDISPENSABLES SEULEMENT ─────────── */
/**
 * Je fournis des versions minimales des composants/SDKs externes.
 * Objectif : rendre les tests déterministes et rapides sans appels réseau.
 */
jest.mock("~/view-trip/components/Footer.jsx", () => () => (
  <div data-testid="footer-mock" />
));

// Mock simple de la lib de toasts
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

// Je nettoie les espions après chaque test pour éviter les fuites d’état.
afterEach(() => {
  jest.clearAllMocks();
});

// Variante virtuelle de sonner (garde-fou si un test importe via un autre chemin)
jest.mock(
  "sonner",
  () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
    },
  }),
  { virtual: true }
);

// OAuth Google : je neutralise le provider et je renvoie une fonction de login factice.
jest.mock(
  "@react-oauth/google",
  () => {
    const React = require("react");
    return {
      GoogleOAuthProvider: ({ children }) =>
        React.createElement(React.Fragment, null, children),
      useGoogleLogin: jest.fn(() => jest.fn()),
      googleLogout: jest.fn(),
    };
  },
  { virtual: true }
);

// Firebase : je fournis des stubs pour éviter toute vraie lecture/écriture.
jest.mock("~/service/firebaseConfig", () => ({ app: {}, db: {} }), {
  virtual: true,
});

jest.mock(
  "firebase/firestore",
  () => ({
    doc: jest.fn(() => ({})),
    setDoc: jest.fn(async () => {}),
    getDoc: jest.fn(async () => ({ exists: () => false })),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(async () => ({ docs: [] })),
  }),
  { virtual: true }
);

// IA : je retourne une réponse minimaliste pour les tests d’intégration UI.
jest.mock(
  "~/service/AIModal",
  () => ({
    generateTripPlan: jest.fn(async () => ({
      hotelOptions: [],
      dailyItinerary: [],
    })),
    chatSession: { sendMessage: jest.fn() },
  }),
  { virtual: true }
);

// Google Places wrapper : je renvoie une structure vide par défaut.
jest.mock(
  "~/service/GlobalApi",
  () => ({
    GetPlaceDetails: jest.fn().mockResolvedValue({ data: { places: [] } }),
  }),
  { virtual: true }
);

// API photo : je calcule une URL factice stable à partir de l’id
jest.mock(
  "~/service/api",
  () => ({
    GetPlacePhoto: jest.fn((id) =>
      Promise.resolve(`https://mocked.com/${id}.jpg`)
    ),
  }),
  { virtual: true }
);

// react-google-places-autocomplete : je remplace par un <input> contrôlé minimal.
jest.mock(
  "react-google-places-autocomplete",
  () => {
    const React = require("react");
    return ({ selectProps = {} }) =>
      React.createElement("input", {
        "data-testid": "gplaces",
        value: selectProps.value?.label || "",
        placeholder: selectProps.placeholder,
        onChange: (e) =>
          selectProps.onChange?.({
            label: e.target.value,
            value: e.target.value,
          }),
      });
  },
  { virtual: true }
);

// Icônes : je fournis des composants factices pour ne pas importer les librairies lourdes.
jest.mock(
  "react-icons/ai",
  () => {
    const React = require("react");
    return {
      AiOutlineLoading3Quarters: () =>
        React.createElement("span", { "data-testid": "spinner" }),
    };
  },
  { virtual: true }
);

jest.mock(
  "react-icons/fc",
  () => {
    const React = require("react");
    return {
      FcGoogle: () =>
        React.createElement("span", { "data-testid": "google-icon" }),
    };
  },
  { virtual: true }
);

jest.mock(
  "lucide-react",
  () => {
    const React = require("react");
    return {
      X: () => React.createElement("span", { "data-testid": "x-icon" }),
      FaMapLocationDot: () => React.createElement("span", null, "map"),
      FaEuroSign: () => React.createElement("span", null, "€"),
      FaMapMarkerAlt: () => React.createElement("span", null, "M"),
      FaStar: () => React.createElement("span", null, "*"),
    };
  },
  { virtual: true }
);

// Link : je remplace par une simple ancre pour éviter d’instancier un Router dans chaque test.
jest.mock(
  "react-router-dom",
  () => {
    const actual = jest.requireActual("react-router-dom");
    const React = require("react");
    return {
      ...actual,
      Link: ({ to = "#", children, ...rest }) =>
        React.createElement(
          "a",
          {
            href: typeof to === "string" ? to : "#",
            "data-testid": "mock-link",
            ...rest,
          },
          children
        ),
    };
  },
  { virtual: true }
);
