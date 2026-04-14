const BASE_URL = 'http://192.168.100.121:3000';

const parseResponse = (data) => {
	// 🛑 No data
	if (!data) return null;

	// ✅ Case 1: { results: [...] }
	if (Array.isArray(data.results)) {
		return data.results.length > 0 ? data.results[0] : null;
	}

	// ✅ Case 2: direct array
	if (Array.isArray(data)) {
		return data.length > 0 ? data[0] : null;
	}

	// ✅ Case 3: single object
	if (typeof data === 'object') {
		return data;
	}

	return null;
};

const handleFetch = async (body) => {
	try {
		const res = await fetch(`${BASE_URL}/search`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		// 🚨 HANDLE HTTP ERRORS (like 403, 500)
		if (!res.ok) {
			const text = await res.text();
			console.log('🚨 API HTTP ERROR:', res.status, text);
			return null;
		}

		const data = await res.json();

		console.log('✅ RAW API RESPONSE:', data);

		const parsed = parseResponse(data);

		if (!parsed) {
			console.log('⚠️ No valid result after parsing');
		}

		return parsed;

	} catch (err) {
		console.log('🚨 FETCH ERROR:', err.message);
		return null;
	}
};

// 🔍 SEARCH BY PRODUCT NAME
export const verifyProductByName = async (name) => {
	if (!name || name.trim() === "") return null;

	return await handleFetch({
		productName: name.trim(),
		notificationNumber: ""
	});
};

// 🔍 SEARCH BY NOTIFICATION NUMBER
export const verifyProductByNN = async (nn) => {
	if (!nn || nn.trim() === "") return null;

	return await handleFetch({
		productName: "",
		notificationNumber: nn.trim().toUpperCase()
	});
};