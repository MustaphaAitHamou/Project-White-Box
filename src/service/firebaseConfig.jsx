// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);