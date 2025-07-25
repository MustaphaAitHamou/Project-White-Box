/* src/setupTests.js */
/* eslint-env jest, node */
/* eslint-disable react/display-name, react/prop-types */

import React from "react";
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.React = React;
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;
if (typeof window !== "undefined" && !window.scrollTo)
  window.scrollTo = () => {};

  globalThis.importMetaEnv ??= {
    VITE_GOOGLE_PLACE_API_KEY: 'test-key',
    VITE_GOOGLE_GEMINI_AI_API_KEY: 'test-gemini',
    VITE_GOOGLE_AUTH_CLIENT_ID: 'test-client',
  };

globalThis.importMetaEnv = { VITE_GOOGLE_PLACE_API_KEY: "test-key" };

/* --------- Silence sélectif des erreurs console --------- */
const origError = console.error;
console.error = (...args) => {
  const msg = String(args[0] ?? "");
  if (msg.includes("Photo fetch error")) return;
  origError(...args);
};

/* ─────────── MOCKS INDISPENSABLES SEULEMENT ─────────── */
jest.mock("~/view-trip/components/Footer.jsx", () => () => (
  <div data-testid="footer-mock" />
));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

// sonner
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

// OAuth Google
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

// Firebase
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

// IA
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

// Google Places wrapper
jest.mock(
  "~/service/GlobalApi",
  () => ({
    GetPlaceDetails: jest.fn().mockResolvedValue({ data: { places: [] } }),
  }),
  { virtual: true }
);

// API photo
jest.mock(
  "~/service/api",
  () => ({
    GetPlacePhoto: jest.fn((id) =>
      Promise.resolve(`https://mocked.com/${id}.jpg`)
    ),
  }),
  { virtual: true }
);

// react-google-places-autocomplete
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

// Icônes
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

// react-router Link (évite d'instancier un Router dans chaque test)
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
