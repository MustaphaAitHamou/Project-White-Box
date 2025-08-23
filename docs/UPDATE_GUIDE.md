<!-- docs/UPDATE_GUIDE.md -->

# UPDATE_GUIDE

## 🎯 Objectif
Mettre à jour les dépendances en préservant **stabilité** et **sécurité**.

## 🗓️ Cadence
- **Hebdo (auto)** : via **Dependabot** (lundi 07:00, `timezone: "Europe/Paris"`), groupes `react-stack` et `tooling`.
- **Mensuel (manuel)** : contrôle `npm outdated` + revue avis sécurité.

## 🔧 Étapes (manuel)
1. **Lister les packages**
   ```bash
   npm outdated
