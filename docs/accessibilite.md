
# Accessibilité

## Référentiel et objectif
Alignement **RGAA 4.1** / **WCAG 2.1 AA**. Cible : score **Lighthouse A11y ≥ 95**.

## Ce qui est en place
- Structure sémantique (`header/main/footer`, titres hiérarchisés, listes).
- Navigation **au clavier** complète ; **focus visible** toujours présent.
- Libellés explicites (`<label>`), `alt` systématiques, `aria-*` lorsque nécessaire.
- Primitives **Radix UI** (Dialog, Popover, Menu…) : ARIA et comportement clavier fiables.
- Palette Tailwind avec contrastes **AA** vérifiés (boutons, liens, toasts).
- Images décoratives marquées `alt=""` ; icônes décoratives avec `aria-hidden`.
- Dialogs/menus : **focus trap**, `Esc` pour fermer, restitution du focus.

## À contrôler régulièrement
- Lecteurs d’écran NVDA/VoiceOver (login + création de voyage).
- axe DevTools + Lighthouse ; corriger tout écart.
- `prefers-reduced-motion` : animations discrètes et non bloquantes.

## Historique rapide
- `alt` manquant sur le logo (corrigé **v1.0.1**).
- Boutons icône sans `aria-label` → complétés.
