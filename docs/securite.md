<!-- docs/securite.md -->

# Sécurité

## Secrets & configuration
- Clés/API via variables d’environnement (Vercel/GitHub), **jamais** en dur.  
- `.env.example` documente les variables attendues.

## Authentification & consentement
- **OAuth Google** (aucun mot de passe stocké).
- Demande de consentement **RGPD** avant login.

## Firestore (moindre privilège)
- Accès limité aux docs de l’utilisateur (`uid`).  
- Pas de noms de docs issus directement d’entrées utilisateur.

## XSS / Injections
- Rendu React (escape) ; pas de `dangerouslySetInnerHTML`.  
- URLs encodées ; `rel="noopener noreferrer"` sur liens externes.  
- SDK Firestore officiel (évite NoSQL injection si règles correctes).

## Abuse & disponibilité
- reCAPTCHA **invisible** au login ; contournement iOS documenté.  
- Quotas API côté Google.  
- Distribution statique (CDN) → surface réduite, absorption rafales.

## Données personnelles
- Export JSON et suppression de compte depuis l’UI.  
- Stockage minimal (trips + consentements).

## Suivi
- UptimeRobot (dispo) + **LHCI** (perf/a11y/SEO).  
- Rotation des clés, revue règles Firestore régulière.
