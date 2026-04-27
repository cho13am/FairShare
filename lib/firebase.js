import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_ui-g3bjzryQEPu90qZc0dDAqBgXssPw",
  authDomain: "fairshare-32915.firebaseapp.com",
  projectId: "fairshare-32915",
  storageBucket: "fairshare-32915.firebasestorage.app",
  messagingSenderId: "40361632456",
  appId: "1:40361632456:web:63b034d029ebfdb133fbfd",
  measurementId: "G-EKGCF7S27C"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);