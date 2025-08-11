# CHANGELOG.md

Toutes les modifications notables sont listées ici (format Keep a Changelog, SemVer).

---

## [1.0.1] - 2025-07-26
### Fixed
- 🐛 Toast d’erreur absent si formulaire vide (`/create-trip`) (#2025-001)
- 🐛 Images hôtels manquantes (fallback placeholder) (#2025-002)
- 🐛 Attribut `alt` manquant sur le logo (A11y) (#2025-003)

## [1.0.0] - 2025-07-22
### Added
- ✅ Connexion Google (OAuth)
- ✅ Génération d’itinéraires (Gemini)
- ✅ Pages `/create-trip`, `/view-trip/:id`, `/my-trips`
- ✅ Consentement RGPD + pages légales
- ✅ Tests unitaires Jest/RTL
- ✅ CI/CD GitHub Actions + packaging Docker + preview Vercel

---

## [0.9.5] - 2025-07-20
### Fixed
- 🐛 Génération limitée à 5 jours → prompt strict + `maxOutputTokens=8192` + `jsonrepair` + normalisation (exactement TOTAL_DAYS) (#2025-020)
- 🐛 Export des données personnelles ne téléchargeait rien → implémentation Blob + `URL.createObjectURL` dans `Header` (#2025-021)

## [0.9.4] - 2025-07-12
### Fixed
- 🐛 Photos d’hôtels absentes sur certaines villes (ex. Tizi Ouzou) → query enrichie `hotelName + hotelAddress`, fallback robuste (#2025-019)
- 🐛 Lien Google Maps ambigu sur certains POI (ex. “Panthéon”) → désambiguïsation via `placeName + destinationLabel` + préférence **coordonnées lat/lng** pour l’URL (#2025-022)


## [0.9.3] - 2025-06-30
### Changed
- 🔄 Retour à **reCAPTCHA v2 invisible** avec **bypass iOS** (détection `isIOS`) + `onErrored` → fallback login direct (sécurisé par OAuth) (#2025-018)

## [0.9.2] - 2025-06-21
### Changed
- 🔄 Passage à **reCAPTCHA v3 invisible** pour éviter le problème d’UI du v2 (cases inaccessibles) (#2025-017)

## [0.9.1] - 2025-06-16
### Fixed
- 🐛 Le lien **“Mes voyages”** n’apparaissait pas en mobile → init `user` depuis `localStorage` + écoute `storage` + événement `userChanged` (#2025-016)

