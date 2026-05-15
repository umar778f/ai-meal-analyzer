// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_3XHqrOLmQM7pssEi73LF2oSJchoshHc",
  authDomain: "ai-meal-analyzer-cc20a.firebaseapp.com",
  projectId: "ai-meal-analyzer-cc20a",
  storageBucket: "ai-meal-analyzer-cc20a.firebasestorage.app",
  messagingSenderId: "354934375262",
  appId: "1:354934375262:web:967445a97477bd6a4645cf",
  measurementId: "G-Q8JPPG8QL5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);