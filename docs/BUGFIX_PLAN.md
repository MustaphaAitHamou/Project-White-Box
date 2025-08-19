# Plan de correction (bugfix)

## Processus
1. **Signalement** (utilisateur, test, monitoring).
2. **Fiche** dans `ANOMALIES_LOG.md` (date, page, symptômes, cause, fix).
3. **Repro** locale + scénario minimal.
4. **Branche** `fix/<slug>` ; ajout d’un **test** évitant la régression.
5. **Correctif** (le plus local possible).
6. **PR** → CI : build, tests + coverage, LHCI sur le build statique.
7. **Merge** → **CHANGELOG.md** mis à jour.
8. **Déploiement** :
   - **Préprod** auto (Vercel) sur PR.
   - **Prod** **manuelle** : `npm run build` puis upload du `dist/` sur IglAO (fallback SPA actif).

## Exemple
- **Bug** : pas de toast erreur si formulaire vide.
- **Test** : Jest vérifie l’appel `toast.error`.
- **Fix** : validation + feedback UI.
- **Livraison** : PR verte → preview OK → build prod → upload IglAO.
