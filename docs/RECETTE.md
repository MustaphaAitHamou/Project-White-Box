# Cahier de recettes

## Scénario 1 — Création d’un voyage
- **Préco** : utilisateur connecté (consentement RGPD).
- **Étapes** : destination “Paris”, 3 jours, budget Modéré, “À deux” → Générer.
- **Attendu** : redirection `/view-trip/:id`, affichage InfoSection + Hôtels + 4 activités/jour ordonnées.
- **Résultat** : ✅

## Scénario 2 — Formulaire incomplet
- **Étapes** : cliquer “Générer” sans rien remplir.
- **Attendu** : toast d’erreur “Veuillez remplir tous les champs”.
- **Résultat** : ✅

## Scénario 3 — Connexion Google
- **Étapes** : “Se connecter” → consentement → OAuth.
- **Attendu** : avatar visible, menu utilisateur, accès “Mes voyages”.
- **Résultat** : ✅

## Scénario 4 — MyTrips (liste)
- **Étapes** : connecté → `/my-trips`.
- **Attendu** : cartes des voyages ; si aucun : message d’état.
- **Résultat** : ✅

## Scénario 5 — Export des données
- **Étapes** : avatar → “Télécharger mes données”.
- **Attendu** : téléchargement JSON `{ user, trips }`.
- **Résultat** : ✅

## Scénario 6 — Suppression de compte
- **Étapes** : avatar → “Supprimer mon compte” → confirmer.
- **Attendu** : suppression docs Firestore liés + déconnexion.
- **Résultat** : ✅

## Scénario 7 — Résilience photos
- **Étapes** : forcer un lieu/hôtel introuvable.
- **Attendu** : affichage placeholder sans erreur bloquante.
- **Résultat** : ✅

## Scénario 8 — Accessibilité de base
- **Étapes** : navigation clavier header → dialogues → boutons.
- **Attendu** : focus visible, libellés cohérents, fermeture `Esc`.
- **Résultat** : ✅
