# CI / CD — Protocole

## CI (intégration continue)
- **Workflow** : `.github/workflows/ci-cd.yml`.
- **Sur push/PR** : build Vite + ESLint, **tests Jest** (coverage) → upload **Codecov** (`coverage/coverage-final.json`) → artefacts (build, rapports LHCI).
- **Lighthouse CI** : audit sur le build statique.

## CD (déploiement continu)
- **Préproduction** : déploiement **automatique** sur **Vercel** (préviews liées aux PR).
- **Production (IglAO)** : **manuelle** pour garder la main :
  1. `npm ci && npm run build`
  2. Uploader le contenu de `dist/` sur IglAO (SFTP / panneau).
  3. Règle **SPA fallback** : toutes les routes → `/index.html`.

## Règles de version
- **SemVer** + **tags Git**. Les releases majeures passent par une validation manuelle en préprod avant upload prod.
