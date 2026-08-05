import { storage } from '@/config/mmkv';
import { auth } from '@/services/auth';
import { db } from '@/services/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, query } from '@react-native-firebase/firestore';

export async function checkProfilingCompletion() {
	if (!auth.currentUser?.uid) return;
	const hasProfilingBeenCompleted = checkLocal();

	if (hasProfilingBeenCompleted === undefined) {
		await checkDB();
	}
}

function checkLocal() {
	return storage.getBoolean('isProfilingComplete');
}

async function checkDB() {
	const queryOption = query(doc(db, 'users', auth.currentUser?.uid));
	const documentSnapshot = await getDoc(queryOption);

	const hasProfilingBeenCompleted = documentSnapshot.get('profiling');

	if (hasProfilingBeenCompleted) {
		storage.set('isProfilingComplete', true);
	}
}

async function saveToLocal(status) {
	const isExistOnLocal = await AsyncStorage.getItem('hasProfilingBeenCompleted');

	if (!isExistOnLocal && status) {
		await AsyncStorage.setItem('hasProfilingBeenCompleted', JSON.stringify(status));
	}
}
