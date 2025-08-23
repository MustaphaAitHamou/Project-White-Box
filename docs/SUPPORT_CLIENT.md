<!-- docs/SUPPORT_CLIENT.md -->

# Support client

## Canaux
- Formulaire “Contact” (site).
- E-mail : **support@tripgenius.eu**

## Exemple représentatif
- **Problème** : voyage “disparu”.  
- **Diag** : `localStorage` vidé.  
- **Action** : restauration via Firestore (`uid`).  
- **Résultat** : voyage récupéré sous 24 h.

## Processus
1. Accusé de réception (< 48 h).  
2. Repro + diagnostic.  
3. Correctif si bug → passage CI.  
4. Consignation dans `ANOMALIES_LOG.md` + MAJ `CHANGELOG.md` si publié.
