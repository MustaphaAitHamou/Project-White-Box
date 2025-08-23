# Tests

Je teste avec **Jest** et **React Testing Library**. Environnement JSDOM.

## Ce que je couvre
- Header : consentement + login/logout.  
- Hero et pages légales : rendu sans erreurs.  
- Cookies : bannière et préférences.  
- PlacesToVisit : ordre des créneaux et fallbacks d’images.

## Technique
- `jest.config.js` : `babel-jest` pour JSX, alias `@/` et `~/` vers `src/`, styles neutralisés via `identity-obj-proxy`.  
- `src/setupTests.js` : polyfills, mocks (OAuth, Firestore, Google Places), réglages RTL.

## Commandes
- Lancer : `npm test`  
- Couverture : `npm test -- --coverage` (la CI publie sur Codecov).

Objectif de couverture réaliste : **≥ 70 %** lignes globales. Je préfère de bons tests utiles à une course au chiffre.
