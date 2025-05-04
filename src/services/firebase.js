// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC2tLFUF0_QEXhdOzGK9j4HW4kEvBjXOCU",
  authDomain: "devgate-app-faeff.firebaseapp.com",
  projectId: "devgate-app-faeff",
  storageBucket: "devgate-app-faeff.firebasestorage.app",
  messagingSenderId: "298916082506",
  appId: "1:298916082506:web:fc9896924278fe9c2fc7b3",
  measurementId: "G-KVW6C0RB1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };