// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQbXI2CS0f0B2AdabIJ9O3okkR1KpV8c4",
  authDomain: "portfolio-5787.firebaseapp.com",
  projectId: "portfolio-5787",
  storageBucket: "portfolio-5787.firebasestorage.app",
  messagingSenderId: "829053218306",
  appId: "1:829053218306:web:a1b2190809c501e1c7811b",
  measurementId: "G-P7GHB6ZPM4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
