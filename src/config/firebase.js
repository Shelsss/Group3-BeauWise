import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCH4wl_Tsz06hZtXlGHVH7uN86Ig-aBau0',
  authDomain: 'beauwise-1687a.firebaseapp.com',
  projectId: 'beauwise-1687a',
  storageBucket: 'beauwise-1687a.firebasestorage.app',
  messagingSenderId: '423229615499',
  appId: '1:423229615499:web:645cc9c557fe9adb39938e',
};

const app = initializeApp(firebaseConfig);

// 🔥 This is what your app will use
export const db = getFirestore(app);