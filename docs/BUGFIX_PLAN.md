# Plan de correction (bugfix) — **mode solo, sans branches**

Ce document décrit **le flux de correction quand on travaille seul**, sans branches ni PR. Tout passe par `main`, avec CI automatique sur chaque push et déploiement prod géré par Vercel (rollback possible depuis le dashboard).

---

## Processus (linéaire, sur `main`)

**Signalement → Consignation → Repro locale → Test rouge → Correctif → Vérifs locales → Push `main` → CI → Déploiement → Clôture**

- **Signalement.** L’anomalie arrive via un retour utilisateur (formulaire), un échec CI (build/tests/couverture) ou la supervision (UptimeRobot, Lighthouse CI).
- **Consignation.** Elle est notée dans `ANOMALIES_LOG.md` avec la date, la version/commit, le contexte (page/composant, navigateur/OS, env), les symptômes, les étapes de repro, les preuves (logs/captures), la sévérité (P0–P3) et une hypothèse de cause.
- **Repro locale.** Scénario minimal et déterministe pour pouvoir tester le correctif.
- **Test d’abord.** Écrire un **test qui échoue** (Jest/RTL) pour figer le comportement attendu et éviter la régression.
- **Correctif minimal.** Implémenter le fix **au plus local** et faire passer le test.
- **Vérifs locales rapides.**
  ```bash
  npm ci
  npm test -- --coverage
  npm run build
  npx @lhci/cli autorun --config=.lighthouserc.json
