import { db } from '@/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const saveHistory = async (data) => {
  try {
    return await addDoc(collection(db, 'history'), {
      query: data.query ?? '',
      type: data.type ?? '',
      resultType: data.resultType ?? '',
      resultData: data.resultData ?? null, // ✅ FIX HERE
      createdAt: new Date()
    });
  } catch (error) {
    console.error("History save error:", error);
  }
};