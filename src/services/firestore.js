import { app } from '@/config/firebase';
import { connectFirestoreEmulator, getFirestore } from '@react-native-firebase/firestore';

const db = getFirestore();

if (__DEV__) {
	const localIP = ['127.0.0.1', '192.168.0.100', '10.141.21.222'];
	connectFirestoreEmulator(db, localIP[1], 8080);
}

export { db };
