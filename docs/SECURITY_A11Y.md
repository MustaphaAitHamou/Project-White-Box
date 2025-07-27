
---

### 📄 2. `SECURITY_A11Y.md` (C2.2.3 – Sécurité et Accessibilité)

```md
# SECURITY_A11Y.md

## 🔐 Sécurité

### ✅ Mesures mises en œuvre
- Authentification Google OAuth avec jeton sécurisé
- Masquage des clés via `.env`
- Aucune donnée sensible stockée côté client
- Utilisation de reCAPTCHA v3 côté frontend
- Contrôle d'accès à certaines routes (vérification du user connecté)

## ♿ Accessibilité

### 📏 Normes suivies
- Référentiel RGAA 4.1 (France)
- Règles WAI-ARIA sur les composants

### ✅ Actions concrètes
- Utilisation de `aria-label`, `role="button"` là où nécessaire
- Contraste texte/fond respecté (rapport > 4.5:1)
- Navigation au clavier possible sur tous les boutons
- Taille de police relative (em/rem)
- Images décoratives marquées `alt=""`

## 🧱 Évolutivité
- Structure modulaire : composants réutilisables, importés par routes
- Code organisé par fonctionnalités (`src/create-trip`, `src/view-trip`, etc.)
- Séparation des préoccupations (auth, hooks, utils, UI)
