// Fichier de configuration Firebase (web).
// Je initialise l’app côté client et j’expose l’instance Firestore.
// Remarque : en production, je préfère charger ces valeurs via des variables d’environnement
// (ex. Vite + window.__ENV__) pour éviter d’exposer des clés en clair dans le dépôt.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Je renseigne les identifiants du projet Firebase. Ces champs permettent à l’SDK
// de cibler le bon projet, et ne suffisent pas à eux seuls à écrire dans la base
// sans les règles de sécurité adéquates (Firestore rules).
const firebaseConfig = {
  apiKey: "AIzaSyDArttV9DzAw2PXGn4FPANMcMzC9u1R8ZI",
  authDomain: "ai-travel-planner-3547d.firebaseapp.com",
  projectId: "ai-travel-planner-3547d",
  storageBucket: "ai-travel-planner-3547d.firebasestorage.app",
  messagingSenderId: "359924171631",
  appId: "1:359924171631:web:0166105f11d582b7e21e9a",
  measurementId: "G-G0C13KZ2RR"
};

// Initialize Firebase
// Je crée l’instance de l’app, puis je récupère un handle Firestore pour les lectures/écritures.
// Je réutilise ces instances partout ailleurs dans l’app pour éviter des doubles initialisations.
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
