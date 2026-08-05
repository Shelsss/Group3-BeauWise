import {
	addDoc,
	collection,
	doc,
	FieldValue,
	setDoc,
	Timestamp
} from '@react-native-firebase/firestore';
import { format, isAfter, parse } from 'date-fns';
import { tz } from '@date-fns/tz';
import { auth } from './auth';
import { db } from './firestore';
export async function fdaService(query, clientTimeZone) {
	query = query.product?.trim() ?? query.notificationNumber?.trim();

	const url = new URL('https://verification.fda.gov.ph/api/search');
	url.searchParams.append('q', query);

	const todayDate = new Date();
	let formattedVerificationDate = format(todayDate, "MMMM d',' yyyy 'at' p", {
		in: tz(clientTimeZone)
	});

	let data = null,
		status;

	const controller = new AbortController();
	const { signal } = controller;

	// 2. Set your manual timeout (e.g., 5000ms)
	const timeoutId = setTimeout(() => controller.abort(), 30000);

	try {
		const response = await fetch(url, {
			signal,
			method: 'GET',
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
				Accept: 'application/json, text/plain, */*',
				'Accept-Language': 'en-US,en;q=0.9',
				Origin: 'https://verification.fda.gov.ph',
				Referer: 'https://verification.fda.gov.ph/',
				Connection: 'keep-alive'
			}
		});

		const result = await response.json();

		console.log('response', response);
		console.log('result', result);

		if (result.error) {
			throw new Error('FDA_SERVER_ERROR');
		}

		if (
			result.cosmetic_NN?.length <= 0 &&
			result.cdrr?.length <= 0 &&
			result.fdafoodproducts?.length <= 0
		) {
			throw new Error('NO_RECORD_FOUND');
		}

		if (result.cosmetic_NN?.length > 0) {
			data = result.cosmetic_NN[0];
		} else if (result.cdrr?.length > 0) {
			data = result.cdrr[0];
		} else if (result.fdafoodproducts?.length > 0) {
			data = result.fdafoodproducts[0];
		}

		status = {
			code: 200,
			text: 'OK'
		};

		const productValidityDate = parse(
			data.NOTIFICATION_VALIDITY,
			'dd MMMM yyyy',
			new Date()
		);

		const isExpired = isAfter(todayDate, productValidityDate);
		const formattedProduct = data.PRODUCT_NAME.split(' ')
			.map((str) => {
				str = str.toLowerCase();

				return str !== 'and' ? str[0].toUpperCase() + str.slice(1) : str;
			})
			.join(' ');

		const formattedProductValidityDate = format(productValidityDate, "MMMM d',' yyyy");

		data = {
			product: formattedProduct,
			company: data.COMPANY_NAME,
			notification_number: data.ACCOUNTCODE,
			is_expired: isExpired,
			product_validity_date: formattedProductValidityDate,
			verification_check_date: formattedVerificationDate
		};

		console.log(data);
	} catch (error) {
		console.log(error);

		status = {
			code: 500,
			text: 'Something went wrong. Please try again later.'
		};

		if (error.name === 'TimeoutError') {
			status = {
				code: 500,
				text: 'Things are running a bit slow. Please try again'
			};
		}

		if (error.message === 'NO_RECORD_FOUND') {
			status = {
				code: 200,
				text: 'the request went through, but no record was found.'
			};

			data = {
				name: query,
				verification_check_date: formattedVerificationDate,
				is_invalid: true
			};
		}

		if (error.message === 'FDA_SERVER_ERROR') {
			status = {
				code: 500,
				text: 'FDA servers are unavailable. Please try again later.'
			};
		}
	} finally {
		clearTimeout(timeoutId);
	}

	if (auth.currentUser) {
		await saveToDB(auth.currentUser.uid, data);
	}

	return {
		data,
		status
	};
}

async function saveToDB(uid, data) {
	const collectionReference = collection(db, 'users');
	const subCollectionReference = collection(db, 'users', uid, 'fda_history');

	await addDoc(subCollectionReference, {
		...data,
		createdAt: Timestamp.now(),
		search_key: data?.product ?? data?.name ?? null
	});

	const userRef = doc(db, 'users', uid);

	await setDoc(
		userRef,
		{
			total_fda_notified: FieldValue.increment(1)
		},
		{ merge: true }
	);
}
