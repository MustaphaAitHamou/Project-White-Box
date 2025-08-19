# Accessibilité

## Référentiel et objectif
Je m’aligne sur **RGAA 4.1** / **WCAG 2.1 AA**. Cible : score **Lighthouse A11y ≥ 95**.

## Ce qui est en place
- Structure sémantique (titres hiérarchisés, `main/header/footer`, listes).
- Navigation **au clavier** opérationnelle, **focus visible** partout.
- Libellés explicites (`<label>`), attributs `alt` systématiques, `aria-*` quand nécessaire.
- Composants **Radix UI** pour bénéficier d’ARIA correcte et comportement clavier natif.
- Couleurs Tailwind avec contrastes **AA** vérifiés (boutons, liens, toasts).
- Images décoratives marquées `alt=""`, icônes avec `aria-hidden` si purement décoratives.
- Dialogs/menus : **focus trap**, fermeture par `Esc`, retour du focus sur le déclencheur.

## À contrôler régulièrement
- Passages au lecteur d’écran (NVDA/VoiceOver) sur login + création de voyage.
- Axe DevTools (extension) et Lighthouse → corriger dès qu’un écart apparaît.
- `prefers-reduced-motion`: animations non bloquantes (déjà soft, à surveiller).

## Historique rapide
- Manque d’`alt` sur le logo (corrigé v1.0.1).
- Quelques boutons icône sans `aria-label` → complété.
