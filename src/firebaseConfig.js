import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNBWYSplagQ4b-Rxh7Vs0P8wQTkPJY-m4",
  authDomain: "user-management-b3963.firebaseapp.com",
  projectId: "user-management-b3963",
  storageBucket: "user-management-b3963.appspot.com",
  messagingSenderId: "475918641428",
  appId: "1:475918641428:web:22a9cc2e9de618bb15ba01",
  measurementId: "G-W6DEXDDX6S",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
