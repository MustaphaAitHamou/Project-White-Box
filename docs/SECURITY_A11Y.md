# Sécurité & Accessibilité (notes complémentaires)

## Sécurité (complément)
- OAuth Google, jetons gérés par le SDK.
- Variables d’environnement masquées ; rien en dur dans le dépôt.
- Export/suppression de compte depuis l’UI (Firestore + nettoyage local).

## Accessibilité (complément)
- Radix UI pour les primitives focusables (dialog, popover).
- `aria-label` pour boutons icône, `aria-live` sur toasts importants.
- Contrastes AA sur les couleurs principales (vérifié Lighthouse).
