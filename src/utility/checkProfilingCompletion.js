import { auth } from '@/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, getFirestore, query } from '@react-native-firebase/firestore';

export async function checkProfilingCompletion() {
	if (!auth.currentUser?.uid) return;

	let hasProfilingBeenCompleted = false;

	hasProfilingBeenCompleted = await checkLocal();

	if (!hasProfilingBeenCompleted) {
		hasProfilingBeenCompleted = await checkDB();
	}

	return hasProfilingBeenCompleted;
}

async function checkLocal() {
	let status = await AsyncStorage.getItem('hasProfilingBeenCompleted');
	status = JSON.parse(status);
	return status;
}

async function checkDB() {
	let status;

	const queryOption = query(doc(getFirestore(), 'users', auth.currentUser?.uid));
	const documentSnapshot = await getDoc(queryOption);

	const hasProfilingBeenCompleted = documentSnapshot.get('profiling');

	if (hasProfilingBeenCompleted) {
		status = true;
		saveToLocal(status);
	} else {
		status = false;
	}

	return status;
}

async function saveToLocal(status) {
	const isExistOnLocal = await AsyncStorage.getItem('hasProfilingBeenCompleted');

	if (!isExistOnLocal && status) {
		await AsyncStorage.setItem('hasProfilingBeenCompleted', JSON.stringify(status));
	}
}
