export const load = async ({ params, fetch }) => {
	try {
		// Validate coordinates format
		const coords = params.coords?.split?.(',');
		if (!coords || coords.length !== 2) {
			throw new Error('Invalid coordinates format');
		}
		
		const [lat, lon] = coords;
		
		// Validate coordinate values
		const latNum = parseFloat(lat);
		const lonNum = parseFloat(lon);
		if (isNaN(latNum) || isNaN(lonNum)) {
			throw new Error('Invalid coordinate values');
		}
		
		const res = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
		
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		
		const data = await res.json();
		
		if (!data.properties) {
			throw new Error('Invalid response from weather API');
		}

		return {
			location: data.properties,
			coords: `${lat},${lon}`
		};
	} catch (error) {
		console.error('Failed to load location data:', error);
		throw error; // Re-throw to trigger SvelteKit error page
	}
};
