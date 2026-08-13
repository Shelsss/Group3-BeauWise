import { auth } from '@/services/auth';
import { db } from '@/services/firestore';
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';
import {
	endOfToday,
	endOfYesterday,
	startOfToday,
	startOfYesterday,
	addMonths,
	startOfMonth
} from 'date-fns';

export function getDocumentFilterToday(collectionReference) {
	const reference = collection(db, 'users', auth.currentUser.uid, collectionReference);
	const documentQuery = query(
		reference,
		where('createdAt', '>=', startOfToday()),
		where('createdAt', '<', endOfToday())
	);

	return async () => {
		const documentSnapshot = await getDocs(documentQuery);

		const items = documentSnapshot.docs.map((doc) => doc.data());

		items.sort((a, b) => {
			if (a.createdAt?.seconds > b.createdAt?.seconds) {
				return 1;
			}

			return -1;
		});

		return [...items] ?? [];
	};
}

export function getDocumentFilterAllTime(collectionReference) {
	const reference = collection(db, 'users', auth.currentUser.uid, collectionReference);
	const documentQuery = query(reference);

	return async () => {
		const documentSnapshot = await getDocs(documentQuery);

		return documentSnapshot.docs.map((doc) => doc.data()) ?? [];
	};
}

export function getDocumentFilterYesterday(collectionReference) {
	const reference = collection(db, 'users', auth.currentUser.uid, collectionReference);
	const documentQuery = query(
		reference,
		where('createdAt', '>=', startOfYesterday()),
		where('createdAt', '<', endOfYesterday())
	);

	return async () => {
		const documentSnapshot = await getDocs(documentQuery);

		const items = documentSnapshot.docs.map((doc) => doc.data());

		items.sort((a, b) => {
			if (a.createdAt?.seconds > b.createdAt?.seconds) {
				return 1;
			}

			return -1;
		});

		return [...items] ?? [];
	};
}

export function getDocumentFilterMonth(collectionReference) {
	const currentDate = new Date();
	const nextMonth = startOfMonth(addMonths(currentDate, 1));
	nextMonth.setMonth(nextMonth.getMonth() + 1);

	const reference = collection(db, 'users', auth.currentUser.uid, collectionReference);
	const documentQuery = query(
		reference,
		where('createdAt', '>=', startOfMonth(currentDate)),
		where('createdAt', '<', nextMonth)
	);

	return async () => {
		const documentSnapshot = await getDocs(documentQuery);

		const items = documentSnapshot.docs.map((doc) => doc.data());

		items.sort((a, b) => {
			if (a.createdAt?.seconds > b.createdAt?.seconds) {
				return 1;
			}

			return -1;
		});

		return [...items] ?? [];
	};
}
