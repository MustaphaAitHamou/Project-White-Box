# Changelog
Toutes les versions suivent [SemVer](https://semver.org/).

## [1.6.1] - 2025-08-23
### Changed
- Dependabot : planification hebdomadaire calée sur **07:00 Europe/Paris** (`timezone: "Europe/Paris"`) pour éviter le décalage UTC.
- Docs CI/CD : précisions sur l’horodatage Dependabot et la lecture des horaires en TZ locale.

## [1.6.0] - 2025-08-16
### Added
- Dossier Bloc 2 (docs CI/CD, Security, A11y, Cahier de recettes, Plan de correction, Manuels)
- `.env.example` et règles Firestore proposées

### Changed
- Pipeline CI (LHCI, Codecov chemin corrigé)
- Optimisations perf (ciblage moderne, préco lazy-load)

### Fixed
- Export JSON stable (messages d’erreur plus robustes)

## [1.5.0] - 2025-08-01
### Added
- Pages conformité (RGPD, Mentions, Cookies)
- Bannière cookie configurable
