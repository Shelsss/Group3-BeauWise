import { auth } from './auth';

export const ingredientAnalysisService = async (
	ingredients,
	product,
	clientTimeZone,
	signal
) => {
	const url = __DEV__
		? 'http://192.168.0.102:5001/beauwise-1687a/asia-southeast1/client-ingredientAnalysisController'
		: 'https://client-ingredientanalysiscontroller-trqiwooh7a-as.a.run.app';

	let userToken = '';

	const headers = {
		'Content-Type': 'application/json'
	};

	if (auth.currentUser) {
		userToken = await auth.currentUser.getIdToken();
		headers['Authorization'] = `Bearer ${userToken}`;
	}

	try {
		const response = await fetch(url, {
			method: 'POST',
			signal,
			headers,
			body: JSON.stringify({
				data: { ingredients, product, clientTimeZone }
			})
		});

		const result = await response.json();

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.result;
	} catch (error) {
		let message = '';

		if (error.message) {
			message = error.message;
		}

		if (error.name === 'AbortError') {
			message = 'The operation was discontinued. Please try again if needed.';
		}
		throw new Error(message);
	}
};
