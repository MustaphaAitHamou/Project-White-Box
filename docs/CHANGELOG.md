# Changelog
Toutes les versions suivent [SemVer](https://semver.org/) et le format **Keep a Changelog**.

## [1.6.1] - 2025-08-23
### Changed
- Dependabot : planification hebdomadaire calée sur **07:00 Europe/Paris** (`timezone: "Europe/Paris"`) pour éviter le décalage UTC.
- Docs CI/CD : précisions sur l’horodatage Dependabot et la lecture des horaires en TZ locale.

### Fixed
- **Export iOS** — *Fixed: export iOS – fallback ouverture dans un onglet* (ouverture du JSON dans un nouvel onglet avec consigne “Enregistrer dans Fichiers”) ; validé sur iOS 16/17 sans régression desktop/Android.

---

## [1.6.0] - 2025-08-16
### Added
- Dossier **Bloc 2** (docs CI/CD, Security, A11y, Cahier de recettes, Plan de correction, Manuels).
- `.env.example` et proposition de règles Firestore.

### Changed
- Pipeline CI : ajout **LHCI** sur artefact statique, durcissement du job de couverture (configuration vérifiée).
- Optimisations perf (target moderne, lazy-load pragmatique).

### Fixed
- Export JSON : structure stable, messages d’erreur plus robustes.

---

## [1.5.0] - 2025-08-01
### Added
- Pages conformité : **RGPD**, **Mentions légales**, **Cookies**.
- Bannière cookies configurable et persistante.

---

## [1.0.1] - 2025-02-20
### Fixed
- Correctifs **UI/A11y** (labels, focus, ARIA), robustesse affichage **hôtels/activités** (fallback image).

---

## [1.0.0] - 2025-02-15
### Added
- Première version **stable** : création d’un voyage (destination, durée, budget, profil), génération IA (Gemini) formatée JSON, consultation par créneaux, sélection d’hôtels.
- Authentification **Google OAuth**, consentement **RGPD**, bannière cookies.
- Export des données personnelles (JSON) et **suppression de compte** (double confirmation).
- **CI/CD** GitHub Actions, déploiement **Vercel** (fallback SPA), préviews par commit.

---

## [0.9.5] - 2025-02-14
### Changed
- Génération d’itinéraires **au-delà de 5 jours** (prompt aligné + normalisation tolérante *N* jours).

---

## [0.9.4] - 2025-02-12
### Added
- Photos d’hôtels plus fiables ; liens **Google Maps** sécurisés via `place_id`.

---

## [0.9.3] - 2025-02-11
### Changed
- reCAPTCHA **v2 invisible** rétabli comme repli, contournement iOS.

---

## [0.9.2] - 2025-02-10
### Added
- reCAPTCHA **v3 invisible** (anti-abus) sur la création de voyage.

---

## [0.9.1] - 2025-02-09
### Added
- Initialisation utilisateur sur **mobile** ; entrée **« Mes voyages »** visible après connexion.

---

## [0.2.1] - 2025-02-05
### Fixed
- CI : **Codecov** échouait (mauvais rapport). Ciblage corrigé vers `coverage/coverage-final.json`.

---

## [0.2.0] - 2025-02-03
### Added
- **Export** des données personnelles (JSON).
- **Suppression de compte** avec double confirmation, purge Firestore.

---

## [0.1.0] - 2025-02-01
### Added
- **MVP** : React 18 + Vite, routing SPA, stockage **Firestore**, Google Places (recherche/photos), squelette UI Tailwind/Radix.
- Flux **création de voyage** (destination, durée, budget, voyageurs).
- **Bannière cookies** à la première visite.

---

## [0.0.0] - 2025-01-25
### Added
- Bootstrap du projet : configuration Vite, ESLint/Jest/RTL, structure de dossiers, intégration CI minimale.
