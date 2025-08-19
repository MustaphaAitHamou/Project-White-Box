# Tests

## Stack
- **Jest** + **@testing-library/react** + **jsdom**.
- Polyfills et mocks dans `src/setupTests.js`.
- Mocks : Google OAuth, Firestore, Google Places, composants lourds/icônes.

## Couverture fonctionnelle (échantillon)
- `Header` : consentement + login/logout.
- `Hero` : rendu.
- `CookieConsent` / `CookieSettings` : affichage et persistance.
- `PlacesToVisit` : tri des activités + fallback image.
- Pages légales : rendu statique.

## Commandes
```bash
npm test
npm test -- --coverage
