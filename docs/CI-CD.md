<!-- docs/CI-CD.md -->

# CI/CD – TripGenius

## Objectifs
- Bloquer les régressions (lint, tests, perf/a11y).
- Produire des artefacts (build, rapports) + previews.
- Assurer la traçabilité (Codecov, LHCI, tags).

## Pipeline GitHub Actions (résumé)
1. **build**  
   `npm ci` → `npm run lint` → `npm run build` → artefact `dist/`.
2. **test**  
   `npm test -- --coverage` → upload **Codecov** (`./coverage/coverage-final.json`).
3. **package** (option)  
   Image Docker buildée et archivée.
4. **deploy-preprod**  
   **Vercel** preview (commit/PR).
5. **lighthouse**  
   `npx @lhci/cli autorun --config=.lighthouserc.json` (sur l’artefact `dist/`).

## Seuils
- Lighthouse Desktop : Perf ≥ 90 ; A11y/BP ≥ 95 ; SEO ≥ 90.
- Couverture : lignes ≥ 70 %.

## Conseils perf
- `build.target: "es2020"`, `manualChunks`, imports dynamiques bibliothèques lourdes.
- Lazy-load Google Autocomplete/OAuth/reCAPTCHA ; `loading="lazy"` images.
- Placeholders robustes + cache long sur assets statiques.
