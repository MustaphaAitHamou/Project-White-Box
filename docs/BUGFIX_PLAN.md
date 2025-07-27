# BUGFIX_PLAN.md

## 🔧 Objectif
Décrire le protocole de correction d’anomalies, de la détection au déploiement.

---

## 🔁 Étapes du processus

1. **Signalement**
   - Par utilisateur via formulaire ou test automatisé

2. **Ouverture de fiche**
   - Renseigner `ANOMALIES_LOG.md`

3. **Reproduction**
   - Exécuter scénario + tester comportement

4. **Branche dédiée**
   - `git checkout -b fix/create-trip-toast`

5. **Ajout d’un test unitaire**
   - Ex : Jest vérifie que `toast.error()` est appelé

6. **Correction du bug**
   - Modifier composant fautif

7. **PR + vérification CI**
   - Pipeline doit valider les tests

8. **Merge + MAJ CHANGELOG**
   - Mise à jour `CHANGELOG.md`

9. **Déploiement**
   - Automatique via CI/CD

---

## Exemple réel
- Date : 25/07/2025
- Bug : Le toast ne s’affiche pas si formulaire vide
- Résolu via : ajout de mock sur `toast.error()`, test unitaire, fix sur `CreateTrip.jsx`
