# Protocole de déploiement continu

## Objectifs
Permettre un déploiement automatisé et sécurisé à chaque mise à jour du code sur la branche `main`.

## Outils utilisés
- GitHub Actions pour la CI/CD
- Docker pour la mise en conteneur
- ArgoCD pour le déploiement continu (prévu)
- ESLint pour le linting
- Jest pour les tests unitaires

## Étapes du pipeline
1. **Build** : Compilation du projet avec Vite
2. **Test** : Exécution des tests unitaires avec Jest
3. **Lint** : Vérification de la qualité du code
4. **Packaging** : Création de l’image Docker
5. **Déploiement** : (prévu) vers une plateforme via ArgoCD