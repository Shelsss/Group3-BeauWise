import {
	httpsCallable,
	getFunctions,
	connectFunctionsEmulator
} from '@react-native-firebase/functions';

const functions = getFunctions();
const localIP = ['127.0.0.1', '192.168.1.16', '10.40.173.222'];
connectFunctionsEmulator(functions, localIP[1], 5001);
const setCallableFunction = (name) => httpsCallable(functions, name);
export async function scanIngredient(imageData) {
	const callable = setCallableFunction('scanIngredients');

	const response = await callable({ imageBase64: imageData });

	return response.data;
}

export async function searchEngine(query) {
	const callable = setCallableFunction('searchEngine');

	const response = await callable({ query });

	return response.data;
}

export async function fdaVerification(query) {
	const callable = setCallableFunction('fdaVerification');

	if (query[0].toLowerCase().startsWith('n')) {
		query = query
			.trim()
			.toUpperCase()
			.split('')
			.filter((item) => item.trim() !== '')
			.join('');
	} else {
		query = query.trim();
	}

	const response = await callable({ query });

	return response.data;
}
export async function verifyEmail(email) {
	console.log('Verify email');
}

export async function checkIfEmailExist(email) {
	const callable = setCallableFunction('auth-checkEmail');

	const response = await callable({ email });

	return response.data;
}
