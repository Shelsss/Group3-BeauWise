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
	updateProfile,
	signOut
} from '@react-native-firebase/auth';

import Toast from 'react-native-toast-message';
import {
	doc,
	getDoc,
	getFirestore,
	query,
	setDoc
} from '@react-native-firebase/firestore';
import { checkIfEmailExist } from './cloudFunctions';

GoogleSignin.configure({
	webClientId: '423229615499-fie2t2v348rs914ahbjppev5vjokuier.apps.googleusercontent.com'
});

export const auth = getAuth();

const db = getFirestore();

export const googleSignIn =
	(isSigningUp = false, showModal, hideModal) =>
	async () => {
		try {
			const response = await GoogleSignin.signIn();

			if (isSuccessResponse(response)) {
				showModal();

				const userInfo = response.data;

				const userEmail = userInfo.user.email;

				const hasEmailAlreadyRegistered = await checkIfEmailExist(userEmail);

				if (hasEmailAlreadyRegistered && isSigningUp) {
					throw Object.assign(new Error('This email is already registered.'), {
						code: 'USER_ALREADY_EXIST'
					});
				}

				if (!hasEmailAlreadyRegistered && !isSigningUp) {
					throw Object.assign(new Error('Please sign up first.'), {
						code: 'USER_NOT_FOUND'
					});
				}

				const credential = GoogleAuthProvider.credential(userInfo.idToken);

				await signInWithCredential(auth, credential);

				if (isSigningUp) {
					await setDoc(doc(db, 'users', auth.currentUser.uid), {
						scanHistory: [],
						fdaHistory: []
					});
				}

				return true;
			}
		} catch (error) {
			let errorMessage;

			if (isErrorWithCode(error)) {
				switch (error.code) {
					case statusCodes.IN_PROGRESS:
						errorMessage = 'Google Sign In already in progress';
						break;
					case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
						errorMessage = 'Play Services not available or outdated';
						break;

					case 'USER_ALREADY_EXIST':
						errorMessage = error.message;
						break;

					case 'USER_NOT_FOUND':
						errorMessage = error.message;
						break;
					default:
						errorMessage = 'An error occured, please try again.';
				}
			}
			logOut();
			Toast.show({
				text1: errorMessage,
				type: 'errorToast'
			});

			return false;
		} finally {
			hideModal();
		}
	};

export const signUp = async (email, password, userName, showModal, hideModal) => {
	try {
		showModal();
		const hasEmailAlreadyRegistered = await checkIfEmailExist(email);

		if (hasEmailAlreadyRegistered) {
			throw Object.assign(new Error('This email is already registered.'), {
				code: 'USER_ALREADY_EXIST'
			});
		}

		const user = await createUserWithEmailAndPassword(auth, email, password);

		await updateProfile(user.user, {
			displayName: userName
		});

		await setDoc(doc(db, 'users', user.user.uid), {
			scanHistory: [],
			fdaHistory: []
		});

		await signInWithEmailAndPassword(auth, email, password);

		return true;
	} catch (error) {
		let errorMessage;

		switch (error.code) {
			case 'auth/email-already-in-use':
				errorMessage = 'This email is already registered.';
				break;

			case 'USER_ALREADY_EXIST':
				errorMessage = error.message;
				break;

			default:
				errorMessage = 'An error occured, please try again.';
		}

		await logOut();

		Toast.show({
			text1: errorMessage,
			type: 'errorToast'
		});
		return false;
	} finally {
		hideModal();
	}
};

export const signIn = async (email, password, showModal, hideModal) => {
	try {
		showModal();
		const hasEmailAlreadyRegistered = await checkIfEmailExist(email);

		if (!hasEmailAlreadyRegistered) {
			throw Object.assign(new Error('Please sign up first.'), {
				code: 'USER_NOT_FOUND'
			});
		}

		await signInWithEmailAndPassword(auth, email, password);
		return true;
	} catch (error) {
		let errorMessage;

		switch (error.code) {
			case 'auth/invalid-credential':
				errorMessage = 'Incorrect password or email';
				break;

			case 'USER_NOT_FOUND':
				errorMessage = error.message;
				break;

			default:
				errorMessage = 'An error occured, please try again.';
				break;
		}

		Toast.show({
			type: 'errorToast',
			text1: errorMessage
		});

		return false;
	} finally {
		hideModal();
	}
};

export const logOut = async () => {
	try {
		if (GoogleSignin.hasPreviousSignIn) {
			await GoogleSignin.signOut();
		}

		if (!auth.currentUser) return;

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
