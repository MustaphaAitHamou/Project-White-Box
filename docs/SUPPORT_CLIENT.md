# SUPPORT_CLIENT.md

## 🎯 Objectif
Documenter le processus de support client mis en œuvre pour TripGenius.

---

## 📬 Canal utilisé
- Formulaire de contact : https://tripgenius.eu/support
- Email : support@tripgenius.eu

---

## 📞 Exemple réel
- **Problème** : Utilisateur ne retrouve pas son voyage généré
- **Date** : 2025-07-24
- **Diagnostic** : le localStorage a été effacé
- **Solution** : Récupération via Firestore (clé par user.uid)
- **Résultat** : Voyage restauré
- **Temps de réponse** : < 24h

---

## 🔁 Processus
1. Signalement utilisateur via formulaire
2. Réponse sous 48h
3. Correction si nécessaire
4. Ajout dans `ANOMALIES_LOG.md`
5. MAJ `CHANGELOG.md` si fix publié
