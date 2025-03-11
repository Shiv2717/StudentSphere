import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA10dFU9EkCh67bEmTJZq2E5xcZCAzjvuU",
    authDomain: "studentsphere-dfad1.firebaseapp.com",
    projectId: "studentsphere-dfad1",
    storageBucket: "studentsphere-dfad1.firebasestorage.app",
    messagingSenderId: "395529468729",
    appId: "1:395529468729:web:8129c0ba9943c77be146e8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);