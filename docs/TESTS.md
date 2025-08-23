<!-- docs/TESTS.md -->

# Tests

Suite **Jest** + **React Testing Library** (JSDOM).

## Périmètre couvert
- Header : consentement + login/logout.  
- Pages légales & Hero : rendu sans erreur.  
- Cookies : bannière + préférences.  
- Itinéraire : ordre des créneaux, fallbacks images.

## Technique
- `jest.config.js` : `babel-jest` pour JSX, alias `@/` & `~/` → `src/`, styles neutralisés (`identity-obj-proxy`).  
- `src/setupTests.js` : polyfills, mocks (OAuth, Firestore, Google Places), réglages RTL.

## Commandes
- Lancer : `npm test`  
- Couverture : `npm test -- --coverage` (la CI publie sur Codecov).

**Objectif** : lignes globales ≥ 70 % (tests utiles > course au chiffre).
