// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1N0hgOflwQSQ5TX4qctm822GLsZVpvYo",
  authDomain: "onulsugo-worker.firebaseapp.com",
  projectId: "onulsugo-worker",
  storageBucket: "onulsugo-worker.appspot.com",
  messagingSenderId: "833993980894",
  appId: "1:833993980894:web:a69042bca6ec5a5aad7b4f",
  measurementId: "G-QSEF773PL9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore();
