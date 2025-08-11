# ANOMALIES_LOG.md

## 🔧 Journal des anomalies

---

### 🐛 Anomalie n°2025-016
- **Date** : 2025-06-16
- **Détectée par** : Test manuel (mobile)
- **Page** : `Header` (toutes pages)
- **Symptôme** : le lien **“Mes voyages”** n’apparaît pas en version mobile après connexion
- **Reproduction** :
  1. Se connecter sur mobile
  2. Ouvrir le menu du header
- **Résultat observé** : le lien n’est pas rendu
- **Gravité** : moyen
- **Cause** : l’état utilisateur n’était pas initialisé depuis `localStorage` au premier rendu
- **Correctif** : initialisation `useState` depuis `localStorage` + écoute `storage` + événement custom `userChanged` pour synchro cross-onglets
- **Fixé dans version** : 0.9.1

---

### 🐛 Anomalie n°2025-017
- **Date** : 2025-06-21
- **Détectée par** : Retour utilisateur
- **Page** : `Header` (dialog de connexion)
- **Symptôme** : **reCAPTCHA v2** (challenge images) – cases non cliquables (overlay UI)
- **Reproduction** : tentative de connexion Google avec reCAPTCHA v2 actif
- **Résultat observé** : impossible de valider le challenge
- **Gravité** : moyen
- **Correctif** : passage à **reCAPTCHA v3 invisible** (score-based)
- **Fixé dans version** : 0.9.2

---

### 🐛 Anomalie n°2025-018
- **Date** : 2025-06-30
- **Détectée par** : Test manuel (iOS/Android)
- **Page** : `Header` (dialog de connexion)
- **Symptôme** : **reCAPTCHA v3** bloque la connexion sur mobile (jeton non renvoyé)
- **Reproduction** : connexion sur iOS/Android
- **Résultat observé** : le flux OAuth ne démarre pas
- **Gravité** : majeur
- **Correctif** : retour à **reCAPTCHA v2 invisible** + **bypass iOS** (détection `isIOS`) + `onErrored()` → fallback connexion directe avec toast ; garde-fou de sécurité via OAuth
- **Fixé dans version** : 0.9.3

---

### 🐛 Anomalie n°2025-019
- **Date** : 2025-07-05
- **Détectée par** : Retour utilisateur
- **Page** : `/view-trip/:id` (onglet Hôtels)
- **Symptôme** : sur certaines destinations (ex. **Tizi Ouzou**) aucune photo d’hôtel (placeholders)
- **Reproduction** :
  1. Générer un voyage “Tizi Ouzou”
  2. Ouvrir “Hôtels recommandés”
- **Résultat observé** : images en placeholder
- **Gravité** : moyen
- **Cause** : la recherche texte était trop vague → mauvais match sans photo
- **Correctif** : amélioration de la **query** `textQuery` avec `hotelName + hotelAddress` et fallback robuste (placeholder) ; gestion d’erreurs silencieuse
- **Fixé dans version** : 0.9.4

---

### 🐛 Anomalie n°2025-020
- **Date** : 2025-07-19
- **Détectée par** : Test manuel + retours
- **Page** : `/create-trip` → génération IA
- **Symptôme** : l’itinéraire ne se génère **que jusqu’à 5 jours**
- **Reproduction** : demander 7–10 jours
- **Résultat observé** : JSON tronqué à ~5 jours
- **Gravité** : majeur
- **Cause** : prompt limitatif + budget tokens trop bas
- **Correctif** : nouveau **prompt strict** (jours illimités + règle “exactement TOTAL_DAYS”) + **maxOutputTokens = 8192** + **jsonrepair** + normalisation/validation côté client
- **Fixé dans version** : 0.9.5

---

### 🐛 Anomalie n°2025-021
- **Date** : 2025-07-20
- **Détectée par** : Test manuel
- **Page** : `Header` → “Télécharger mes données”
- **Symptôme** : le téléchargement des données personnelles ne démarre pas
- **Reproduction** :
  1. Menu utilisateur → “Télécharger mes données”
- **Résultat observé** : aucun fichier
- **Gravité** : moyen
- **Cause** : tentative initiale côté réseau alors que tout est client
- **Correctif** : implémentation **100% client-side** via `Blob` + `URL.createObjectURL` (fonction `downloadJSON`) après fetch Firestore ; toasts de feedback
- **Fixé dans version** : 0.9.5

---

### 🐛 Anomalie n°2025-022
- **Date** : 2025-07-12
- **Détectée par** : Retour utilisateur
- **Page** : `/view-trip/:id` → PlacesToVisit (PlaceCardItem)
- **Symptôme** : le lien “Voir sur Google Maps” ouvre parfois le mauvais lieu (ex. “Panthéon” → Paris au lieu de Rome) ou propose plusieurs villes.
- **Reproduction** :
  1. Créer un voyage en Italie (ex. Rome)
  2. Cliquer sur la carte d’un POI générique (ex. “Panthéon”)
- **Résultat observé** : Google Maps affiche le Panthéon de Paris, ou une recherche ambiguë avec plusieurs résultats.
- **Gravité** : moyen
- **Cause** : l’URL Maps était construite à partir du nom seul, sans contexte de destination ; en cas d’ambiguïté le moteur choisissait une autre ville.
- **Correctif** : enrichissement de la requête (`textQuery`) avec `placeName + destinationLabel` et, lorsqu’on reçoit une **location** Google Places, construction du lien **à partir des coordonnées** (`https://www.google.com/maps/search/?api=1&query=lat,lng`) avec fallback sur une recherche texte encodée si pas de lat/lng.
- **Fixé dans version** : 0.9.4
