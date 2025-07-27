# UPDATE_GUIDE.md

## 🔄 Objectif
Mettre à jour les dépendances du projet tout en garantissant sa stabilité.

---

## 🗓️ Fréquence
- **Chaque mois** : vérification des dépendances (`npm outdated`)
- **À chaque sprint** : vérification sécurité (`npm audit`)

---

## 🔧 Étapes à suivre

1. **Lister les packages obsolètes**
```bash
npm outdated
