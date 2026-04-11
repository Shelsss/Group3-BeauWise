import firebase from '@react-native-firebase/app';
import {
	httpsCallable,
	getFunctions,
	connectFunctionsEmulator
} from '@react-native-firebase/functions';

const functions = getFunctions();

connectFunctionsEmulator(functions, '127.0.0.1', 5001);
const fetchData = (name) => httpsCallable(functions, name);
export async function scanIngredient(imageData) {
	return fetchData('scanIngredients').stream({ imageBase64: imageData });
}
