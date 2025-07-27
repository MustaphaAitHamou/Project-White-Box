# ANOMALIES_LOG.md

## 🔧 Journal des anomalies

---

### 🐛 Anomalie n°2025-001

- **Date** : 2025-07-25
- **Détectée par** : Test unitaire Jest
- **Page** : `/create-trip`
- **Symptôme** : le toast ne s'affiche pas si champs non remplis
- **Reproduction** :
  1. Ne rien remplir
  2. Cliquer sur "Générer"
- **Résultat observé** : rien ne se passe
- **Gravité** : mineur
- **Correctif** : ajouter un `toast.error()` + test
- **Fixé dans version** : 1.0.1
