<!-- docs/protocole-deploiement-continu.md -->

# CI / CD — Protocole

## CI (intégration continue)
- Workflow : `.github/workflows/ci-cd.yml`.
- Sur **push/PR** : build Vite + ESLint → **tests Jest** (coverage) → upload **Codecov** (`coverage/coverage-final.json`) → artefacts (`dist/`, rapports LHCI).
- **LHCI** : audit sur l’artefact statique.

## CD (déploiement)
- **Preview** : déploiement **automatique** sur **Vercel** à chaque commit/PR.  
- **Production** : publication via Vercel (fallback SPA).  
  Règle : accès direct à toute route interne → `index.html`.

## Versionning
- **SemVer** + tags Git.  
- Majeures : validation manuelle préalable sur preview.
