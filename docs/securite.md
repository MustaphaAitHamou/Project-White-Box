# Sécurité du projet

## Variables sensibles
Toutes les clés API et secrets sont stockés dans un fichier `.env` local (non versionné). Exemple :
```
VITE_GOOGLE_PLACE_API_KEY=xxxxxxxxxxxx
```

## Authentification
Le système d’authentification utilise Firebase Authentication avec OAuth Google sécurisé.

## Suivi des dépendances
- `npm audit`
- `npm outdated`
- Mises à jour manuelles vérifiées mensuellement

## Failles OWASP couvertes
- Pas de mot de passe stocké
- Authentification via fournisseur externe
- Séparation du code front/back