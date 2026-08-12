import { getApp } from '@react-native-firebase/app';
import {
	httpsCallable,
	getFunctions,
	connectFunctionsEmulator
} from '@react-native-firebase/functions';

const functions = getFunctions();

if (__DEV__) {
	const localIP = ['127.0.0.1', '192.168.0.100', '10.141.21.222'];
	connectFunctionsEmulator(functions, localIP[1], 5001);
}
const setCallableFunction = (name) => httpsCallable(functions, name);
export async function ingredientScan(imageBase64) {
	const callable = setCallableFunction('client-ingredientScan');

	const response = await callable({ imageBase64 });

	return response.data;
}

export async function searchEngine({ query, collectionKey }) {
	const callable = setCallableFunction('client-searchEngine');

	const response = await callable({ query, collectionKey });

	return response.data;
}

export async function fdaVerification(query) {
	const callable = setCallableFunction('client-fdaVerification');

	const response = await callable({
		query: { ...query.data },
		clientTimeZone: query.clientTimeZone
	});

	if (response.data?.error) {
		throw new Error(response.data?.error);
	}

	return response.data;
}

export async function batchCodeLookup(query) {
	const callable = setCallableFunction('client-batchCode');

	const response = await callable({ query });

	return response.data;
}

export async function sendEmailVerification(userInfo) {
	const callable = setCallableFunction('client-auth-sendEmailVerificationCode');

	const response = await callable(userInfo);

	return response.data;
}

export async function verifyEmail({ code, userInfo }) {
	const callable = setCallableFunction('client-auth-verifyEmail');

	const response = await callable({ code, userInfo });

	return response.data ?? null;
}

export async function sendPasswordReset(userInfo) {
	const callable = setCallableFunction('client-auth-passwordReset');

	const response = await callable(userInfo);

	return response.data;
}

export async function verifyPasswordReset({ code, userInfo }) {
	const callable = setCallableFunction('client-auth-verifyPasswordReset');

	const response = await callable({ code, userInfo });

	return response.data;
}

export async function changePassword({ email, password }) {
	const callable = setCallableFunction('client-auth-changeUserPassword');

	const response = await callable({ email, password });

	return response.data;
}

export async function changeEmail({ newEmail, previousEmail }) {
	const callable = setCallableFunction('client-auth-changeUserEmail');

	const response = await callable({ newEmail, previousEmail });

	return response.data;
}

export async function secureLogin({ email, password }) {
	const callable = setCallableFunction('client-auth-secureLogin');

	const response = await callable({ email, password });

	return response.data;
}

export async function checkIfUserAlreadyExist(email) {
	let response;

	try {
		const callable = setCallableFunction('client-auth-checkIfUserAlreadyExist');
		response = await callable({ email });
	} catch (error) {
		console.trace(error);
	}

	return response.data;
}

export async function analyzeIngredients({ ingredients, product, clientTimeZone }) {
	const callable = setCallableFunction('client-ingredientAnalysisController');

	const response = await callable({
		ingredients,
		product,
		clientTimeZone
	});

	if (response.data?.error) {
		throw new Error(response.data?.error);
	}

	return response.data;
}

export async function cancelAccountDeletion() {
	const callable = setCallableFunction('client-auth-cancelAccountDeletion');

	const response = await callable();

	return response.data;
}

export async function requestAccountDeletion() {
	const callable = setCallableFunction('client-auth-requestAccountDeletion');

	const response = await callable();

	return response.data;
}
