# Supervision

## Outils
- **UptimeRobot** : ping HTTP(s) de l’URL publique toutes les 5 min, alertes mail/mobile.
- **Lighthouse CI** : audit perf/a11y/SEO sur le build statique en CI.

## Indicateurs cibles
- Disponibilité > 99.9 %
- Taux d’erreur < 1 %
- Perf Lighthouse Desktop ≥ 90 / A11y ≥ 95

## Réaction
- Downtime > 1 min → vérification hébergeur (IglAO) + relance.
- Perf en baisse → analyse bundle (Vite/rollup) + lazy import des libs lourdes.
