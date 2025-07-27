# RECETTE.md

## Objectif
Vérifier que les principales fonctionnalités de l’application fonctionnent comme prévu.

---

### 🔹 Scénario 1 – Création d’un voyage

- **URL** : `/create-trip`
- **Préconditions** : Utilisateur connecté
- **Étapes** :
  1. Entrer destination = "Athènes"
  2. Sélectionner budget = "Modéré"
  3. Cliquer "Générer"
- **Résultat attendu** : redirection vers `/view-trip/:id` avec itinéraire
- **Statut** : ✅ OK le 25/07/2025

---

### 🔹 Scénario 2 – Formulaire incomplet

- **URL** : `/create-trip`
- **Étapes** :
  1. Ne rien remplir
  2. Cliquer "Générer"
- **Résultat attendu** : toast d'erreur "Veuillez remplir tous les champs"
- **Statut** : ✅ OK (testé via Jest + manuel)

---

### 🔹 Scénario 3 – Connexion Google

- **URL** : `/`
- **Étapes** :
  1. Cliquer "Se connecter"
  2. Se connecter via Google
- **Résultat attendu** : affiche nom de l’utilisateur + menu profil
- **Statut** : ✅ OK

---
