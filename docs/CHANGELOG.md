

# Changelog
Toutes les versions suivent [SemVer](https://semver.org/) et le format **Keep a Changelog**.

## [1.6.1] - 2025-08-23
### Changed
- Dependabot : planification hebdo calée sur **07:00 Europe/Paris** (`timezone: "Europe/Paris"`) pour éviter le décalage UTC.
- Docs CI/CD : précisions sur l’horodatage Dependabot et la lecture des horaires en TZ locale.

### Fixed
- CI : **Upload Codecov** — le workflow pointe désormais vers `./coverage/coverage-final.json` (format Jest).
- **Export iOS** — *Fixed: export iOS – fallback ouverture dans un onglet* (ouverture du JSON dans un nouvel onglet avec consigne “Enregistrer dans Fichiers”) ; validé iOS 16/17, aucune régression desktop/Android.

---

## [1.6.0] - 2025-08-16
### Added
- Dossier **Bloc 2** (CI/CD, Security, A11y, Recette, Plan de correction, Manuels).
- `.env.example` et proposition de règles Firestore.

### Changed
- Pipeline CI : ajout **LHCI** sur artefact statique, durcissement couverture (chemin Codecov corrigé).
- Optimisations perf (ciblage moderne, lazy-load pragmatique).

### Fixed
- Export JSON : structure stabilisée, messages d’erreur plus robustes.

---

## [1.5.0] - 2025-08-01
### Added
- Pages conformité (**RGPD**, **Mentions**, **Cookies**).
- Bannière cookies configurable et persistante.

---

## [1.0.1] - 2025-02-20
### Fixed
- Correctifs **UI/A11y** (labels, focus, ARIA).  
- Résilience photos hôtels/activités (placeholders).

---

## [1.0.0] - 2025-02-15
### Added
- Première **version stable** : création/consultation de voyage, génération IA (Gemini), sélection d’hôtels.
- **OAuth Google**, consentement RGPD, bannière cookies.
- Export JSON + **suppression de compte**.
- **CI/CD** GitHub Actions, déploiement **Vercel** (fallback SPA), previews par commit.

---

## [0.9.5] - 2025-02-14
### Changed
- Génération d’itinéraires **> 5 jours** (prompt + normalisation N jours).

---

## [0.9.4] - 2025-02-12
### Added
- Photos d’hôtels plus fiables ; liens **Google Maps** via `place_id`.

---

## [0.9.3] - 2025-02-11
### Changed
- reCAPTCHA **v2 invisible** rétabli (repli iOS).

---

## [0.9.2] - 2025-02-10
### Added
- reCAPTCHA **v3 invisible** (anti-abus).

---

## [0.9.1] - 2025-02-09
### Added
- Initialisation utilisateur mobile ; lien **Mes voyages** visible après connexion.

---

## [0.2.1] - 2025-02-05
### Fixed
- CI : **Codecov** échouait (mauvais rapport) ; ciblage corrigé vers `coverage/coverage-final.json`.

---

## [0.2.0] - 2025-02-03
### Added
- **Export JSON** des données personnelles.
- **Suppression de compte** (double confirmation) + purge Firestore.

---

## [0.1.0] - 2025-02-01
### Added
- **MVP** : React 18 + Vite, routing SPA, Firestore, Google Places (recherche/photos), Tailwind/Radix.
- Flux **création de voyage** (destination, durée, budget, voyageurs).
- **Bannière cookies** (première visite).

---

## [0.0.0] - 2025-01-25
### Added
- Bootstrap du projet : Vite, ESLint/Jest/RTL, structure de dossiers, **CI** minimale.
