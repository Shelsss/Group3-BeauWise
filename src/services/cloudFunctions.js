import {
	httpsCallable,
	getFunctions,
	connectFunctionsEmulator
} from '@react-native-firebase/functions';

const functions = getFunctions();

connectFunctionsEmulator(functions, '10.37.224.222', 5001);
const setCallableFunction = (name) => httpsCallable(functions, name);
export async function scanIngredient(imageData) {
	const callable = setCallableFunction('scanIngredients');

	const response = await callable({ imageBase64: imageData });

	return response.data;
}

export async function verifyEmail(email) {
	console.log(this);
}
