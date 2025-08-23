<!-- docs/RECETTE.md -->

# Cahier de recettes

## Scénario 1 — Création de voyage
- Préconditions : utilisateur connecté (consentement RGPD).  
- Étapes : destination “Paris”, 3 jours, budget “Modéré”, “À deux” → Générer.  
- Attendu : redirection `/view-trip/:id`, affichage infos + hôtels + activités ordonnées.

## Scénario 2 — Formulaire incomplet
- Étapes : cliquer “Générer” sans rien remplir.  
- Attendu : **toast d’erreur**.

## Scénario 3 — Connexion Google
- Étapes : consentement → OAuth.  
- Attendu : avatar visible, menu utilisateur, **Mes voyages** accessible.

## Scénario 4 — MyTrips
- Étapes : connecté → `/my-trips`.  
- Attendu : liste de voyages ; sinon état vide explicite.

## Scénario 5 — Export données
- Étapes : avatar → “Télécharger mes données”.  
- Attendu : fichier JSON `{ user, trips }`.

## Scénario 6 — Suppression de compte
- Étapes : avatar → “Supprimer mon compte” → double confirmation.  
- Attendu : suppression docs liés + déconnexion.

## Scénario 7 — Résilience photos
- Étapes : destination pauvre en photos.  
- Attendu : **placeholder** propre, aucune erreur console.

## Scénario 8 — A11y de base
- Étapes : navigation clavier (header → dialogues → boutons).  
- Attendu : focus visible, labels, `Esc` fonctionne.

> Tous les scénarios doivent être rejoués sur la **preview Vercel** avant publication.
