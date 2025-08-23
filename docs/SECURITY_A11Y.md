<!-- docs/SECURITY_A11Y.md -->

# Sécurité & Accessibilité — notes complémentaires

## Sécurité (complément)
- Jetons OAuth gérés par le SDK Google.  
- Secrets **jamais** embarqués dans le client.  
- Export/suppression de compte côté UI (Firestore + nettoyage local).

## Accessibilité (complément)
- Radix UI pour les composants complexes (Dialog, Popover, Menu…).  
- `aria-label` sur boutons icône, `aria-live` pour toasts importants.  
- Contrastes AA vérifiés par Lighthouse ; navigation clavier validée.
