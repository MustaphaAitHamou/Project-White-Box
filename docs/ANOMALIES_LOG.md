<!-- ANOMALIES_LOG.md -->

# Journal des anomalies

Je note ici les incidents détectés pendant la recette et leur traitement. Les identifiants renvoient aux issues GitHub (branches `fix/Bxx-*`). Les dates sont au format AAAA-MM-JJ.

---

### B01 — Codecov n’uploadait pas la couverture
- **Signalement** : 2025-02-05  
- **Correction** : 2025-02-05 — **Statut** : Résolu — **Sévérité** : Haute  
- **Symptômes** : étape Codecov en échec sur la CI, badge grisé sur la PR.  
- **Environnement** : GitHub Actions.  
- **Impact** : visibilité qualité absente → blocage revue de code.  
- **Détection** : job rouge dans le workflow (logs Codecov “file not found”).  
- **Cause racine** : mauvais chemin (`vitest-final.json` alors que Jest génère `coverage-final.json`).  
- **Correctif** : upload sur `./coverage/coverage-final.json` + nettoyage du step.  
- **Vérification/NR** : job vert + badge Codecov mis à jour.  
- **Évidence** : (capture du job Codecov vert et du badge à jour).

---

### B02 — Performance Lighthouse < 0,90
- **Signalement** : 2025-02-06  
- **Correction** : 2025-02-09 — **Statut** : Résolu — **Sévérité** : Haute  
- **Symptômes** : Perf < 90, LCP > 3 s sur la preview.  
- **Environnement** : build prod, preview Vercel.  
- **Impact** : UX dégradée, non-respect des objectifs.  
- **Détection** : rapport LHCI dans la CI.  
- **Cause racine** : bundle trop gros, libs chargées alors qu’inutiles.  
- **Correctif** : split par routes (`React.lazy`/`Suspense`), imports dynamiques pour OAuth/reCAPTCHA/Autocomplete, `manualChunks` Vite.  
- **Vérification/NR** : Perf ≥ 90, LCP ≤ 2,5 s sur la preview.  
- **Évidence** : (captures Lighthouse avant/après).

---

### B03 — Risque d’exposition de clés `.env.local`
- **Signalement** : 2025-02-07  
- **Correction** : 2025-02-07 — **Statut** : Résolu — **Sévérité** : Haute  
- **Symptômes** : suspicion d’empreinte de clés dans l’historique.  
- **Environnement** : dépôt Git.  
- **Impact** : risque sécurité si fuite.  
- **Détection** : audit `.gitignore` + scan secrets.  
- **Cause racine** : mauvaise pratique historique ; absence de `.env.example`.  
- **Correctif** : purge historique, rotation des clés, ajout `.env.example`, stockage des secrets dans GitHub/Vercel.  
- **Vérification/NR** : scan secrets = 0 findings ; build OK avec variables d’env côté CI.  
- **Évidence** : (capture des secrets configurés et du scan à zéro).

---

### B04 — Règles Firestore trop ouvertes
- **Signalement** : 2025-02-08  
- **Correction** : 2025-02-08 — **Statut** : Résolu — **Sévérité** : Haute  
- **Symptômes** : un utilisateur pouvait lister des docs d’un autre lors de tests.  
- **Environnement** : Firestore (émulateur).  
- **Impact** : fuite potentielle de données.  
- **Détection** : test manuel avec deux comptes.  
- **Cause racine** : règles par défaut permissives.  
- **Correctif** : règles “propriétaire uniquement” basées sur l’UID ; tests à l’émulateur.  
- **Vérification/NR** : accès refusé pour utilisateur tiers, autorisé pour le propriétaire.  
- **Évidence** : (capture des règles et des tests émulateur).

---

### B05 — Accessibilité : labels/focus manquants
- **Signalement** : 2025-02-09  
- **Correction** : 2025-02-10 — **Statut** : Résolu — **Sévérité** : Moyenne  
- **Symptômes** : éléments non labellisés, focus peu visible.  
- **Environnement** : UI (Header, dialogues).  
- **Impact** : obstacles pour lecteurs d’écran et navigation clavier.  
- **Détection** : axe DevTools + parcours clavier.  
- **Cause racine** : oublis de libellés sur des boutons icône / contraste perfectible.  
- **Correctif** : `aria-label`, renfort style de focus, hiérarchie de titres, `aria-live` pour toasts critiques.  
- **Vérification/NR** : A11y ≥ 95 Lighthouse ; parcours clavier fluide.  
- **Évidence** : (captures axe + Lighthouse).

---

### B06 — reCAPTCHA v3 capricieux sur mobile
- **Signalement** : 2025-02-10  
- **Correction** : 2025-02-12 — **Statut** : Résolu — **Sévérité** : Haute  
- **Symptômes** : authentification bloquée chez certains utilisateurs mobiles.  
- **Environnement** : téléphones Android/iOS.  
- **Impact** : impossibilité de se connecter.  
- **Détection** : retours tests + logs.  
- **Cause racine** : score trop strict / UX v3 non fiable sur certains navigateurs.  
- **Correctif** : fallback v2 invisible, ajustement du score côté serveur, temporisation.  
- **Vérification/NR** : connexions mobiles OK sans hausse d’abus.  
- **Évidence** : (courte vidéo d’un flow mobile réussi).

---

### B07 — Mauvaises ouvertures Google Maps
- **Signalement** : 2025-02-11  
- **Correction** : 2025-02-12 — **Statut** : Résolu — **Sévérité** : Haute  
- **Symptômes** : clic sur un lieu menant parfois à un homonyme (ex. Panthéon Paris vs Rome).  
- **Environnement** : ouverture d’URL Google Maps.  
- **Impact** : confusion utilisateur.  
- **Détection** : tests sur destinations ambiguës.  
- **Cause racine** : recherche par nom libre vs identifiant.  
- **Correctif** : ouverture par `place_id` + contexte pays/région.  
- **Vérification/NR** : 3 destinations ambiguës ouvrent le bon POI.  
- **Évidence** : (captures des 3 cas).

---

### B08 — Hôtels absents / photos manquantes
- **Signalement** : 2025-02-11  
- **Correction** : 2025-02-13 — **Statut** : Résolu — **Sévérité** : Moyenne  
- **Symptômes** : cartes vides ou sans image pour certaines villes.  
- **Environnement** : liste d’hôtels (Places API).  
- **Impact** : UX dégradée, parfois page “vide”.  
- **Détection** : tests sur destinations peu couvertes.  
- **Cause racine** : requête trop stricte + absence de fallback.  
- **Correctif** : requête affinée (`hotel|lodging`), seuils de qualité, placeholders robustes.  
- **Vérification/NR** : aucune erreur console, image réelle ou placeholder propre.  
- **Évidence** : (captures cartes avec placeholders).

---

### B09 — Export JSON incomplet
- **Signalement** : 2025-02-12  
- **Correction** : 2025-02-12 — **Statut** : Résolu — **Sévérité** : Haute  
- **Symptômes** : fichier téléchargé incomplet/incohérent.  
- **Environnement** : bouton “Télécharger mes données”.  
- **Impact** : non-conformité RGPD.  
- **Détection** : test manuel + lecture du JSON.  
- **Cause racine** : assembleur de données partiel.  
- **Correctif** : sérialisation claire de `{ user, trips }` + test de schéma.  
- **Vérification/NR** : JSON lisible et complet ; test unitaire vert.  
- **Évidence** : (extrait anonymisé du JSON).

---

### B10 — Itinéraires limités à cinq jours
- **Signalement** : 2025-02-13  
- **Correction** : 2025-02-14 — **Statut** : Résolu — **Sévérité** : Moyenne  
- **Symptômes** : génération tronquée au-delà de 5 jours.  
- **Environnement** : génération IA + mapping.  
- **Impact** : fonctionnalités amputées pour longs séjours.  
- **Détection** : essais avec 7/10 jours.  
- **Cause racine** : prompt restrictif + normalisation qui coupait.  
- **Correctif** : prompt ajusté, normalisation tolérante N jours.  
- **Vérification/NR** : itinéraires valides sur 7 à 10 jours.  
- **Évidence** : (captures d’itinéraires 7 et 10 jours).

---

### B11 — Lien “Mes voyages” absent en mobile
- **Signalement** : 2025-02-14  
- **Correction** : 2025-02-14 — **Statut** : Résolu — **Sévérité** : Basse  
- **Symptômes** : item masqué en viewport étroit.  
- **Environnement** : header responsive.  
- **Impact** : navigation incomplète en mobile.  
- **Détection** : test visuel + RTL en viewport mobile.  
- **Cause racine** : condition d’affichage + CSS.  
- **Correctif** : correction du layout + test RTL dédié.  
- **Vérification/NR** : lien visible et cliquable sur mobile.  
- **Évidence** : (capture du header mobile).

---

### B12 — Pas de toast d’erreur sur formulaire vide
- **Signalement** : 2025-02-14  
- **Correction** : 2025-02-15 — **Statut** : Résolu — **Sévérité** : Basse  
- **Symptômes** : absence de feedback quand des champs obligatoires manquent.  
- **Environnement** : page Création de voyage.  
- **Impact** : incompréhension côté utilisateur.  
- **Détection** : test manuel.  
- **Cause racine** : oubli d’appel `toast.error()`.  
- **Correctif** : ajout du toast + validation plus explicite.  
- **Vérification/NR** : toast visible et test RTL vert.  
- **Évidence** : (capture du toast).

---

## Méthode commune
Chaque anomalie a son issue GitHub avec reproduction, cause, correctif, critères d’acceptation et la PR associée. Toute correction passe la CI (lint, tests, LHCI) et alimente le CHANGELOG.
