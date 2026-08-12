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
	signOut,
	connectAuthEmulator,
	signInWithCustomToken
} from '@react-native-firebase/auth';

import Toast from 'react-native-toast-message';
import { checkIfUserAlreadyExist, secureLogin } from './cloudFunctions';

GoogleSignin.configure({
	webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID
});

export const auth = getAuth();

if (__DEV__) {
	const localIP = ['127.0.0.1', '192.168.0.100', '10.141.21.222'];
	connectAuthEmulator(auth, `http://${localIP[1]}:9099`);
}

export const googleSignIn =
	(isSigningUp = false, showModal, hideModal) =>
	async () => {
		try {
			const response = await GoogleSignin.signIn();

			if (isSuccessResponse(response)) {
				showModal();

				const userInfo = response.data;

				const userEmail = userInfo.user.email;

				const result = await checkIfUserAlreadyExist(userEmail);

				if (result.exists && !!isSigningUp) {
					throw Object.assign(new Error('Invalid login credentials. Please try again.'), {
						code: 'USER_ALREADY_EXIST'
					});
				}

				if (!result.exists && isSigningUp) {
					await logOut();
					return {
						isSignedIn: false,
						isEmailVerificationRequired: true,
						userInfo: {
							credential: GoogleAuthProvider.credential(userInfo.idToken),
							email: userInfo.user.email,
							name: userInfo.user.name
						}
					};
				}

				if (!result.exists && !isSigningUp) {
					throw Object.assign(new Error('Invalid login credentials. Please try again.'), {
						code: 'USER_NOT_FOUND'
					});
				}

				if (result.provider_id !== 'google.com') {
					throw Object.assign(new Error('Invalid login credentials. Please try again.'), {
						code: 'INVALID_PROVIDER'
					});
				}

				const credential = GoogleAuthProvider.credential(userInfo.idToken);

				await signInWithCredential(auth, credential);

				return { isSignedIn: true };
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
					case 'INVALID_PROVIDER':
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

			return { isSignedIn: false };
		} finally {
			hideModal();
		}
	};

export const signUp = async (email, password, name, showModal, hideModal) => {
	try {
		showModal();
		const result = await checkIfUserAlreadyExist(email);

		if (result.exists) {
			throw Object.assign(new Error('This email is already registered.'), {
				code: 'USER_ALREADY_EXIST'
			});
		}

		return {
			isSignedIn: false,
			isEmailVerificationRequired: true,
			userInfo: {
				email,
				password,
				name
			}
		};
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
		return { isSignedIn: false };
	} finally {
		hideModal();
	}
};

export const signIn = async (email, password, showModal, hideModal) => {
	try {
		showModal();
		const hasEmailAlreadyRegistered = await checkIfUserAlreadyExist(email);

		if (!hasEmailAlreadyRegistered) {
			throw Object.assign(new Error('Please sign up first.'), {
				code: 'USER_NOT_FOUND'
			});
		}

		const response = await secureLogin({ email, password });

		if (response?.success) {
			await signInWithCustomToken(auth, response.token);
		} else {
			throw Object.assign(new Error(response.message), {
				code: response.code,
				lockedUntil: response.lockedUntil,
				remainingAttempts: response.remainingAttempts
			});
		}

		return { success: true };
	} catch (error) {
		let errorMessage;

		let isAccountLock = false,
			lockedUntil = null,
			remainingAttempts = null;

		switch (error.code) {
			case 'account-locked':
				isAccountLock = true;
				lockedUntil = error.lockedUntil;
				errorMessage = error.message;
				break;

			case 'invalid-credentials':
				remainingAttempts = error.remainingAttempts;
				errorMessage = error.message;
				break;

			case 'permission-denied':
				errorMessage = error.message;
				break;

			case 'cancelled':
				errorMessage = error.message;
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
			text1: errorMessage,
			visibilityTime: 12000
		});

		return { success: false, isAccountLock, lockedUntil, remainingAttempts };
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
