# Journal des anomalies

> Log chronologique des problèmes rencontrés + correctifs appliqués.

---

### 🐛 2025-001 — Toast d’erreur absent si formulaire vide
- **Date** : 2025-07-25 — **Page** : `/create-trip`
- **Symptôme** : rien ne se passe si on clique “Générer” sans remplir.
- **Cause** : aucune remontée d’erreur UI sur validation.
- **Fix** : `toast.error()` + test Jest (vérifie l’appel).
- **Version** : 1.0.1

---

### 🐛 2025-016 — “Mes voyages” absent en mobile
- **Date** : 2025-06-16 — **Lieu** : `Header`
- **Cause** : user non initialisé depuis `localStorage` au 1er rendu.
- **Fix** : init `useState` depuis `localStorage`, écoute `storage`, event custom `userChanged` (synchro onglets).
- **Version** : 0.9.1

---

### 🐛 2025-017 — reCAPTCHA v2 : cases inaccessibles (overlay UI)
- **Date** : 2025-06-21 — **Lieu** : `Header` (login)
- **Fix** : passage à **reCAPTCHA v3 invisible**.
- **Version** : 0.9.2

---

### 🐛 2025-018 — reCAPTCHA v3 bloque la connexion sur mobile
- **Date** : 2025-06-30 — **Lieu** : `Header` (login)
- **Cause** : jeton non renvoyé (mobile).
- **Fix** : retour **v2 invisible** + bypass iOS (détection `isIOS`) + `onErrored` → fallback connexion directe (flux OAuth sécurisé).
- **Version** : 0.9.3

---

### 🐛 2025-019 — Photos d’hôtels absentes (ex. Tizi Ouzou)
- **Date** : 2025-07-05 — **Lieu** : `ViewTrip/:id` → Hôtels
- **Cause** : query trop vague → mauvais match sans photo.
- **Fix** : `textQuery = hotelName + hotelAddress`, fallback placeholder, gestion d’erreurs silencieuse.
- **Version** : 0.9.4

---

### 🐛 2025-020 — Itinéraires limités à 5 jours
- **Date** : 2025-07-19 — **Lieu** : `/create-trip`
- **Cause** : prompt limitatif + budget tokens trop bas.
- **Fix** : prompt strict (“exactement TOTAL_DAYS”), `maxOutputTokens=8192`, `jsonrepair`, normalisation/validation client.
- **Version** : 0.9.5

---

### 🐛 2025-021 — Export des données ne télécharge rien
- **Date** : 2025-07-20 — **Lieu** : `Header`
- **Cause** : tentative côté réseau alors que tout est client.
- **Fix** : export **100 % client** via `Blob` + `URL.createObjectURL` après fetch Firestore.
- **Version** : 0.9.5

---

### 🐛 2025-022 — Lien Google Maps ambigu (ex. Panthéon)
- **Date** : 2025-07-12 — **Lieu** : `ViewTrip/:id` → PlacesToVisit
- **Cause** : URL basée sur le nom seul.
- **Fix** : `placeName + destinationLabel` ; si lat/lng dispo → URL par **coordonnées** (`/maps/search/?api=1&query=lat,lng`), sinon recherche texte encodée.
- **Version** : 0.9.4
