export const baseUrl = `https://api.weather.gov`;

export const api = {
	getAdvisories: (lat: number, long: number) =>
		`${baseUrl}/alerts/active?point=${lat}%2C${long}&limit=5`,
	getWeatherByCoords: (lat: number, long: number) => `${baseUrl}/points/${lat},${long}`,
	getStationsByGridpoint: (gridpoint: string) => `${baseUrl}/gridpoints/${gridpoint}/stations`
};

/* Unit Conversions */
export const celsiusToFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;

export const kilometersToMiles = (km: number) => Math.round(km / 1.609_34);

export const metersToMiles = (m: number) => Math.round(m * 0.00062137);

export const getWeatherImage = (presentWeather: unknown[], textDescription: string) => {
	const weatherImageMap: { [key: string]: string } = {
		cloudy: 'CC_Cloudy.gif',
		rain: 'CC_Rain.gif',
		fog: 'CC_Fog.gif',
		partly_cloudy: 'CC_PartlyCloudy0.gif'
	};

	const precipitationKeywords = ['rain', 'drizzle', 'snow', 'thunderstorm'];
	const fogKeywords = ['fog', 'mist', 'haze'];
	const cloudKeywords = ['cloudy', 'partly_cloudy'];

	// Use presentWeather first if available
	if (presentWeather.length > 0) {
		const weatherKey = (presentWeather[0] as { weather: keyof typeof weatherImageMap }).weather;
		return weatherImageMap[weatherKey] ? `/${weatherImageMap[weatherKey]}` : null;
	}

	// Normalize textDescription
	const normalized = textDescription
		.toLowerCase()
		.replace(/light|moderate|heavy/g, '') // Remove intensity modifiers
		.replace(/\/| /g, '_'); // Replace spaces and slashes with underscores

	// Split into keywords
	const words = normalized.split('_');

	// Check for precipitation first
	for (const word of words) {
		if (precipitationKeywords.includes(word)) {
			return `/${weatherImageMap[word]}`;
		}
	}

	// Check for fog/mist/haze
	for (const word of words) {
		if (fogKeywords.includes(word)) {
			return `/${weatherImageMap[word]}`;
		}
	}

	// Check for cloud coverage
	for (const word of words) {
		if (cloudKeywords.includes(word)) {
			return `/${weatherImageMap[word]}`;
		}
	}

	// No match found, return null
	return null;
};
