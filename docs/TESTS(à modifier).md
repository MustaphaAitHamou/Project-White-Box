# TESTS.md

## 🧪 Objectif
Ce document présente la stratégie de tests unitaires mise en œuvre pour l’application TripGenius.

## 📦 Outils utilisés
- `Jest` : framework de test JavaScript
- `@testing-library/react` : pour tester les composants React
- `jsdom` : environnement simulant le DOM
- `babel-jest` : transpilation JSX

## Fonctionnalités couvertes
| Composant         | Type de test     | Objectif                                 |
|------------------|------------------|------------------------------------------|
| Header           | unitaire         | Vérifie login, logout, affichage menu    |
| CreateTrip       | unitaire         | Valide erreurs formulaire                |
| PlaceCardItem    | unitaire         | Affiche image + lien Google Maps         |
| InfoSection      | snapshot         | Rend correctement un texte statique      |
| HotelCardItems   | unitaire         | Affiche hôtels avec fallback image       |
| TripList         | DOM + props      | Affiche liste dynamique des voyages      |

## Exécution
```bash
npm run test
# ou
npx jest
