import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzpozd_Xy_17g63184Jmv4qGTGL5-lWsk",
  authDomain: "nailit-7cbbb.firebaseapp.com",
  projectId: "nailit-7cbbb",
  storageBucket: "nailit-7cbbb.firebasestorage.app",
  messagingSenderId: "46115717670",
  appId: "1:46115717670:web:f865f18a109804dd645ce7",
  measurementId: "G-Y9ZHSM958Y"
};

// Initialize firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app)
export const db = getFirestore(app)
