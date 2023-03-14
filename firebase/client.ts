// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVr2TPO2bGnHPqoj_3AKkDX77tfCTfR1g",
  authDomain: "ambition-app-e0ffb.firebaseapp.com",
  projectId: "ambition-app-e0ffb",
  storageBucket: "ambition-app-e0ffb.appspot.com",
  messagingSenderId: "430713726400",
  appId: "1:430713726400:web:af5cb7b401de5fdd8ed425",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const clientAuth = getAuth(app);
export const db = getFirestore(app);
export const cloudFunction = getFunctions(app);
