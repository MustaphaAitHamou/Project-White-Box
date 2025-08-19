# Sécurité

## Secrets et configuration
- Clés/API uniquement dans `.env.local` (non versionné) ou variables Vercel/IglAO.
- `.env.example` fourni pour le mapping.

## Authentification et consentement
- **Google OAuth** (pas de mot de passe stocké).
- Consentement RGPD affiché avant login.

## Firestore (accès minimal)
- Lecture/écriture limitées à l’utilisateur connecté (docs liés à son `uid`).
- Pas de noms de collections/documents construits directement depuis les entrées utilisateur.

## Protection XSS / injections
- Rendu React (escape par défaut) ; pas de `dangerouslySetInnerHTML`.
- URLs encodées ; liens externes `rel="noopener noreferrer"`.
- Pas de SQL ; SDK Firestore officiel (évite injections NoSQL si règles ok).

## Abuse & disponibilité
- reCAPTCHA **invisible** au login ; bypass spécifique iOS documenté.
- Quotas activés côté APIs Google.
- Site servi en statique (CDN/IglAO) : peu d’attaque de surface, rafales mieux absorbées.

## Données personnelles
- Export JSON (`Header`) côté client.
- Suppression de compte disponible depuis l’UI.
- Stockage minimal (trips + consentement).

## Suivi
- UptimeRobot + LHCI ; revues régulières des règles Firestore et rotation des clés si besoin.
