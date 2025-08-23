<!-- docs/ANOMALIES_LOG.md -->

# Journal des anomalies

Source unique des incidents détectés et de leur traitement.  
Contexte **solo** : pas d’issues/PR GitHub ; tout est consigné ici, relié au **SHA** et à l’entrée correspondante du `CHANGELOG.md`.  
Dates au format AAAA-MM-JJ.

---

### B01 — Codecov n’uploadait pas la couverture
- **Signalement** : 2025-02-05  
- **Correction** : 2025-02-05 — **Statut** : Résolu — **Sévérité** : Haute  
- **Symptômes** : étape Codecov en échec, badge grisé.  
- **Environnement** : GitHub Actions.  
- **Impact** : qualité invisible → régressions possibles.  
- **Détection** : job rouge (“file not found”).  
- **Cause racine** : mauvais chemin (`vitest-final.json` alors que Jest génère `coverage-final.json`).  
- **Correctif** : ciblage `./coverage/coverage-final.json` + nettoyage du step.  
- **Vérification/NR** : job vert + badge Codecov à jour.

---

### B02 — Performance Lighthouse < 0,90
- **Signalement** : 2025-02-06  
- **Correction** : 2025-02-09 — **Statut** : Résolu — **Sévérité** : Haute  
- **Symptômes** : Perf < 90, LCP > 3 s.  
- **Environnement** : build prod, preview Vercel.  
- **Cause racine** : bundle trop gros, libs inutiles chargées.  
- **Correctif** : split par routes (`React.lazy`/`Suspense`), imports dynamiques (OAuth/reCAPTCHA/Autocomplete), `manualChunks` Vite.  
- **Vérification/NR** : Perf ≥ 90, LCP ≤ 2,5 s.

---

### B03 — Risque d’exposition de clés `.env.local`
- **Signalement** : 2025-02-07  
- **Correction** : 2025-02-07 — **Sévérité** : Haute  
- **Correctif** : purge ciblée, rotation clés, ajout `.env.example`, secrets côté GitHub/Vercel.  
- **Vérification/NR** : scan secrets = 0 ; build OK en CI.

---

### B04 — Règles Firestore trop ouvertes
- **Signalement/Correction** : 2025-02-08 — **Sévérité** : Haute  
- **Correctif** : règles “propriétaire uniquement” via `uid` ; tests émulateur.  
- **Vérification/NR** : accès refusé tiers, autorisé propriétaire.

---

### B05 — A11y : labels/focus manquants
- **Signalement** : 2025-02-09 — **Correction** : 2025-02-10 — **Sévérité** : Moyenne  
- **Correctif** : `aria-label`, focus renforcé, hiérarchie titres, `aria-live` toasts.  
- **Vérification/NR** : Lighthouse A11y ≥ 95.

---

### B06 — reCAPTCHA v3 capricieux mobile
- **Signalement** : 2025-02-10 — **Correction** : 2025-02-12 — **Sévérité** : Haute  
- **Correctif** : fallback v2 invisible, ajustement score serveur, temporisation.  
- **Vérification/NR** : connexions mobiles OK.

---

### B07 — Mauvaises ouvertures Google Maps
- **Signalement** : 2025-02-11 — **Correction** : 2025-02-12 — **Sévérité** : Haute  
- **Correctif** : ouverture par `place_id` + contexte.  
- **Vérification/NR** : cas ambigus OK.

---

### B08 — Hôtels absents / photos manquantes
- **Signalement** : 2025-02-11 — **Correction** : 2025-02-13 — **Sévérité** : Moyenne  
- **Correctif** : requêtes affinées, seuils qualité, placeholders robustes.  
- **Vérification/NR** : pas d’erreur console, rendu propre.

---

### B09 — Export JSON incomplet
- **Signalement/Correction** : 2025-02-12 — **Sévérité** : Haute  
- **Correctif** : sérialisation claire `{ user, trips }` + test de schéma.  
- **Vérification/NR** : JSON lisible et complet.

---

### B10 — Itinéraires limités à cinq jours
- **Signalement** : 2025-02-13 — **Correction** : 2025-02-14 — **Sévérité** : Moyenne  
- **Correctif** : prompt ajusté, normalisation tolérante N jours.  
- **Vérification/NR** : OK sur 7–10 jours.

---

### B11 — Lien “Mes voyages” absent en mobile
- **Signalement/Correction** : 2025-02-14 — **Sévérité** : Basse  
- **Correctif** : layout + test RTL dédié.  
- **Vérification/NR** : lien visible/cliquable.

---

### B12 — Pas de toast d’erreur formulaire vide
- **Signalement** : 2025-02-14 — **Correction** : 2025-02-15 — **Sévérité** : Basse  
- **Correctif** : `toast.error()` + validation plus explicite.  
- **Vérification/NR** : test RTL vert.

---

## Méthode commune (projet solo)
Chaque anomalie ouvre une **entrée** dans ce fichier (repro, cause, correctif, critères d’acceptation, **SHA**).  
Toute correction passe la **CI** (lint, tests, couverture, **LHCI**).  
MAJ `CHANGELOG.md`, puis déploiement ; si régression, **rollback Vercel** immédiatement.
