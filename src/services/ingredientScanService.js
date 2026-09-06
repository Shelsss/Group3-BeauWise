export const ingredientScanService = async (imageBase64, signal) => {
	const url = __DEV__
		? 'http://192.168.0.102:5001/beauwise-1687a/asia-southeast1/client-ingredientScan'
		: 'https://client-ingredientscan-trqiwooh7a-as.a.run.app';

	try {
		const response = await fetch(url, {
			method: 'POST',
			signal,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				data: { imageBase64 }
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
