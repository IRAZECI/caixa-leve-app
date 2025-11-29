// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Suas chaves (já coloquei as que você mandou)
const firebaseConfig = {
  apiKey: "AIzaSyB6fmfbBj93E-fvM7_QAr89e8vb42jpipM",
  authDomain: "caixa-leve-app.firebaseapp.com",
  projectId: "caixa-leve-app",
  storageBucket: "caixa-leve-app.firebasestorage.app",
  messagingSenderId: "605002930070",
  appId: "1:605002930070:web:516f0668cafab5b504afb7",
  measurementId: "G-1H1BQHCWQT"
};

// 1. Inicializa o app
const app = initializeApp(firebaseConfig);

// 2. Inicializa o Banco de Dados (Firestore) e EXPORTA para usarmos nas telas
export const db = getFirestore(app);