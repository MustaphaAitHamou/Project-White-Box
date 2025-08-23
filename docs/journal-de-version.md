# Journal de version (vue d’ensemble)

> Vue synthétique des principales évolutions.  
> Le détail (Added / Changed / Fixed, numéros d’issues, liens CI) est dans `CHANGELOG.md`.

---

## 0.9.1 — 2025-05-18
- Initialisation fiable de l’utilisateur sur mobile ; l’entrée **Mes voyages** s’affiche correctement.

## 0.9.2 — 2025-05-22
- Intégration de **reCAPTCHA v3 invisible** pour protéger le flux d’authentification.

## 0.9.3 — 2025-05-26
- **Fallback v2 invisible** et ajustement iOS pour limiter les blocages sur certains appareils.

## 0.9.4 — 2025-05-30
- Récupération des **photos d’hôtels** via Places v1 ; ouverture **Google Maps** désambiguïsée (usage du *place_id*).

## 0.9.5 — 2025-06-02
- Génération d’itinéraires **au-delà de 5 jours** (prompt strict + normalisation côté UI).

## 1.0.0 — 2025-06-10
- **Première version stable** : parcours complet (OAuth Google, IA), pages clés, CI/CD de base et déploiements Vercel.

## 1.0.1 — 2025-06-14
- Correctifs **UI/A11y** (libellés, focus) et meilleure **résilience photos** sur la page hôtels.

## 1.1.0 — 2025-06-30
- **Export des données** (JSON `{ user, trips }`) et **suppression de compte** avec double confirmation.

## 1.1.1 — 2025-07-02
- **Toast d’erreur** sur formulaire de création incomplet ; visibilité du lien **Mes voyages** en mobile corrigée.

## 1.2.0 — 2025-07-10
- **Code-splitting par routes** et chargements différés des bibliothèques lourdes (OAuth, reCAPTCHA) pour améliorer le LCP/TTI.

## 1.2.1 — 2025-07-12
- Fallbacks **images** plus robustes (placeholder dédié) ; logs nettoyés quand une photo est indisponible.

## 1.3.0 — 2025-07-20
- **Règles Firestore** resserrées (documents accessibles au seul propriétaire) et rotation des **secrets** ; ajout d’un `.env.example`.

## 1.4.0 — 2025-07-28
- Seuils de **couverture** appliqués en CI ; corrections mineures sur les tests (mocks OAuth/Firestore/Places).

## 1.5.0 — 2025-08-01
- Pages **conformité** (RGPD, mentions légales, cookies) et **bannière cookies** avec préférences persistées.

## 1.6.0 — 2025-08-16
- **Pipeline CI** consolidé : intégration **Lighthouse CI**, **chemin Codecov** corrigé (rapport Jest), artefacts conservés.  
- **Documentation Bloc 2** ajoutée (CI/CD, sécurité, accessibilité, recettes, plan de correction).  
- **Export JSON** rendu plus stable (schéma et erreurs unifiées).

---
**Note :** cette vue d’ensemble reflète les étapes marquantes. Pour chaque version, le fichier `CHANGELOG.md` liste précisément les éléments *Added*, *Changed* et *Fixed* avec les références utiles.
