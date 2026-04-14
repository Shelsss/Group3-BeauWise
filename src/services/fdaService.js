import { db } from '@/config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const verifyProductByName = async (name) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('productName', '==', name)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return snapshot.docs[0].data();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const verifyProductByNN = async (nn) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('notificationNumber', '==', nn)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return snapshot.docs[0].data();
  } catch (error) {
    console.error(error);
    return null;
  }
};