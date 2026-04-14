import {
	GoogleSignin,
	isErrorWithCode,
	isSuccessResponse,
	statusCodes
} from '@react-native-google-signin/google-signin';

import {
	signInWithCredential,
	getAuth,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
	signOut,
	getAdditionalUserInfo
} from '@react-native-firebase/auth';

import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/stores/useAuthStore';
import {
	collection,
	doc,
	getDoc,
	getFirestore,
	query,
	setDoc
} from '@react-native-firebase/firestore';

GoogleSignin.configure({
	webClientId: '423229615499-fie2t2v348rs914ahbjppev5vjokuier.apps.googleusercontent.com'
});

export const auth = getAuth();

const db = getFirestore();

export const googleSignIn =
	(isSigningUp = false) =>
	async () => {
		try {
			const response = await GoogleSignin.signIn();
			if (isSuccessResponse(response)) {
				const userInfo = response.data;

				const credential = GoogleAuthProvider.credential(userInfo.idToken);

				const userCredentials = await signInWithCredential(auth, credential);

				const isNewUser = userCredentials.additionalUserInfo.isNewUser;

				const isUserExistInDB = await checkUserExistInDB();

				if (!isNewUser && isUserExistInDB && isSigningUp) {
					throw new Error('This email is already registered');
				}

				if (isSigningUp) {
					await setDoc(doc(db, 'users', auth.currentUser.uid), {
						scanHistory: []
					});
					return true;
				}

				if (isNewUser || !isUserExistInDB) {
					throw Object.assign(new Error('Please sign up first.'), {
						code: 'USER_NOT_FOUND'
					});
				}

				return true;
			}
		} catch (error) {
			let errorMessage = error.message;

			if (isErrorWithCode(error)) {
				switch (error.code) {
					case statusCodes.IN_PROGRESS:
						errorMessage = 'Google Sign In already in progress';
						break;
					case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
						errorMessage = 'Play Services not available or outdated';
						break;

					case 'USER_NOT_FOUND':
						await signOut(auth);
						break;
					default:
						errorMessage = 'An error occured, please try again.';
				}
			}

			console.log(errorMessage);

			Toast.show({
				text1: errorMessage,
				type: 'error'
			});

			return false;
		}
	};

export const signUp = async (email, password, userName) => {
	try {
		const user = await createUserWithEmailAndPassword(auth, email, password);

		await updateProfile(user.user, {
			displayName: userName
		});

		await setDoc(doc(db, 'users', user.user.uid), {
			scanHistory: []
		});

		return true;
	} catch (error) {
		if (error.code === 'auth/email-already-in-use') {
			Toast.show({
				type: 'error',
				text1: 'This email is already registered.',
				text2: 'Please try again'
			});
		}

		return false;
	}
};

export const signIn = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		return true;
	} catch (error) {
		if (error.code === 'auth/invalid-credential') {
			Toast.show({
				type: 'error',
				text1: 'Incorrect password or email',
				text2: 'Please try again'
			});
		}
	}
};

export const logOut = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.log(error);
	}
};

async function checkUserExistInDB() {
	const queryOption = query(doc(getFirestore(), 'users', auth.currentUser?.uid));

	const documentSnapshot = await getDoc(queryOption);
	return documentSnapshot.exists();
}
