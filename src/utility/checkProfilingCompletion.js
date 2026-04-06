import { auth } from '@/services/auth';
import { doc, getDoc, getFirestore, query } from '@react-native-firebase/firestore';

export async function checkProfilingCompletion() {
	if (!auth.currentUser?.uid) return;

	const queryOption = query(doc(getFirestore(), 'users', auth.currentUser?.uid));

	const documentSnapshot = await getDoc(queryOption);
	const isUserExist = documentSnapshot.exists();
	const hasProfilingBeenCompleted = documentSnapshot.get('profiling');
	if (!isUserExist) return;

	if (!hasProfilingBeenCompleted) {
		return false;
	}

	return true;
}
