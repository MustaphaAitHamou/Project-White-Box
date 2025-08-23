<!-- docs/BUGFIX_PLAN.md -->

# Plan de correction (bugfix) — mode **solo** (sans branches)

Flux quand on travaille seul : tout passe par `main`, CI automatique sur chaque push, déploiement prod Vercel (rollback possible).

## Processus
**Signalement → Consignation → Repro locale → Test rouge → Correctif → Vérifs locales → Push `main` → CI → Déploiement → Clôture**

- **Signalement** : retour utilisateur (formulaire), échec CI (build/tests/coverage), supervision (UptimeRobot, LHCI).
- **Consignation** : entrée dans `ANOMALIES_LOG.md` (date, env, symptômes, repro, gravité P0–P3, hypothèse).
- **Repro locale** : scénario minimal et déterministe.
- **Test d’abord** : écrire un **test qui échoue** (Jest/RTL) pour figer l’attendu.
- **Correctif minimal** : appliquer le fix **au plus local** pour limiter l’impact.
- **Vérifs locales**
  ```bash
  npm ci
  npm test -- --coverage
  npm run build
  npx -y @lhci/cli@latest autorun --config=.lighthouserc.json
