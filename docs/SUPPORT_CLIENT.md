# Support client

## Canaux
- Formulaire “Contact” sur le site.
- Mail : support@tripgenius.eu

## Exemple réel
- **Contexte** : l’utilisateur ne retrouve plus son voyage.
- **Diag** : localStorage vidé.
- **Action** : récupération via Firestore (clé = `user.uid`).
- **Résultat** : voyage restauré en < 24 h.

## Processus
1. Accusé de réception (< 48 h).
2. Repro + diag.
3. Correctif si bug → PR + CI.
4. Log dans `ANOMALIES_LOG.md` et MAJ `CHANGELOG.md` si publié.
