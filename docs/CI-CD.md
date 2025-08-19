# CI/CD – TripGenius

## Objectifs
- Empêcher les régressions (lint, tests, perf/a11y).
- Produire des artefacts (build, rapports) et des previews.
- Donner de la traçabilité (Codecov, LHCI reports, tags).

## Pipeline GitHub Actions
1. **Build**  
   - `npm ci`  
   - `npm run lint`  
   - `npm run build` → artefact `dist/`

2. **Tests**  
   - `npm test -- --coverage`  
   - Upload **Codecov** (`./coverage/coverage-final.json`)

3. **Packaging Docker** (option)

4. **Preview Vercel** (preprod)

5. **Lighthouse CI**  
   - `lhci autorun --config=.lighthouserc.json`  
   - Assert “no-pwa” preset (scores min)  
   - Upload report (temporary storage)

## Seuils recommandés
- Lighthouse Perf ≥ 90; A11y ≥ 95; BP ≥ 95; SEO ≥ 90.
- Couverture lignes ≥ 70 %.

## Conseils perf
- `build.target: "es2020"`, `manualChunks`, dynamic imports des libs lourdes.
- Lazy-load du composant Google Autocomplete, EmailJS, react-icons.
- Images avec fallback, cache long sur assets statiques.
