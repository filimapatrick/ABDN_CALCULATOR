import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqzk4qbg3cqslBI1M1NVjys11q0oT36bY",
  authDomain: "abdnevaluation.firebaseapp.com",
  projectId: "abdnevaluation",
  storageBucket: "abdnevaluation.appspot.com",
  messagingSenderId: "265298008627",
  appId: "1:265298008627:web:70d84a7d1a85f9b7222146"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
