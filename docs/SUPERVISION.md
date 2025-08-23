<!-- docs/SUPERVISION.md -->

# Supervision & alertes

## Outils
- **UptimeRobot** : ping HTTPS de l’URL publique toutes les **5 min**, alertes e-mail.  
- **Lighthouse CI** : audits planifiés sur l’artefact de build (CI GitHub).

## Indicateurs cibles
- Disponibilité ≥ **99,5 %** / mois.  
- Perf Lighthouse Desktop ≥ **90** ; A11y/BP ≥ **95**.

## Réaction
- **2 sondes** consécutives en échec : vérifier déploiements + hébergeur, **rollback** éventuel.  
- Perf en baisse : analyser bundle (split, lazy), images (taille/cache), Web Vitals.

## Conformité
- Traces minimales (logs CI, captures techniques), conservation courte, pas de données perso en clair.
