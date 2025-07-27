
---

### 📄 6. `SUPERVISION.md` (C4.1.2)

```md
# SUPERVISION.md

## 🎯 Objectif
Assurer que l'application TripGenius reste disponible, performante et surveillée en continu.

---

## 📡 Outils utilisés

- **UptimeRobot**
  - Type : HTTP(s) Monitor
  - URL surveillée : https://tripgenius.eu
  - Fréquence : toutes les 5 minutes
  - Alertes : email + notification sur mobile
  - Objectif : 99.9% de disponibilité

- **Lighthouse CI**
  - Rapport de performance (accessibilité, SEO, PWA)
  - Score minimum attendu : 90/100

---

## 🔔 Alertes

- Downtime > 1 min → email immédiat
- Perf < 0.75 Lighthouse → alerté manuellement

---

## 📈 Indicateurs clés

| Indicateur      | Cible       |
|----------------|-------------|
| Disponibilité  | > 99.9 %    |
| Taux d'erreur  | < 1 %       |
| Temps de réponse | < 500 ms |
