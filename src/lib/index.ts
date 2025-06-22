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

/* Wind Direction Conversion */
export const directionToNSEW = (direction: number | null | undefined): string => {
	if (direction === null || direction === undefined || isNaN(direction)) {
		return '';
	}
	const val = Math.floor((direction / 22.5) + 0.5);
	const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	return arr[(val % 16)];
};

/* Wind Speed Conversion (km/h to mph) - matches ws4kp formula */
export const kmhToMph = (kmh: number | null | undefined): number => {
	if (kmh === null || kmh === undefined || isNaN(kmh)) {
		return 0;
	}
	return Math.round(kmh / 1.609_34); // Convert km/h to mph (ws4kp formula)
};

/* Format Wind Display */
export const formatWind = (direction: number | null | undefined, speed: number | null | undefined): string => {
	const windDirection = directionToNSEW(direction);
	// Match ws4kp approach: round km/h first, then convert to mph
	const roundedSpeed = speed ? Math.round(speed) : 0;
	const windSpeed = kmhToMph(roundedSpeed);
	
	if (!windDirection || windSpeed === 0) {
		return '';
	}
	
	return `${windDirection} ${windSpeed}`;
};

// Weather condition mapping based on NWS condition codes (ws4kp style with full icon set)
const weatherIconMap: { [key: string]: { day: string; night: string } } = {
	// Clear conditions
	'skc': { day: 'CC_Clear1.gif', night: 'CC_Clear0.gif' },      // Sky Clear
	'nskc': { day: 'CC_Clear1.gif', night: 'CC_Clear0.gif' },     // Night Sky Clear
	'hot': { day: 'CC_Clear1.gif', night: 'CC_Clear0.gif' },      // Hot
	'haze': { day: 'CC_Clear1.gif', night: 'CC_Clear0.gif' },     // Haze
	'cold': { day: 'CC_Clear1.gif', night: 'CC_Clear0.gif' },     // Cold
	
	// Cloud conditions
	'few': { day: 'CC_PartlyCloudy1.gif', night: 'CC_PartlyCloudy0.gif' }, // Few clouds
	'nfew': { day: 'CC_PartlyCloudy1.gif', night: 'CC_PartlyCloudy0.gif' }, // Night Few clouds
	'sct': { day: 'CC_PartlyCloudy1.gif', night: 'CC_PartlyCloudy0.gif' }, // Scattered clouds
	'nsct': { day: 'CC_PartlyCloudy1.gif', night: 'CC_PartlyCloudy0.gif' }, // Night Scattered clouds
	'bkn': { day: 'CC_PartlyCloudy1.gif', night: 'CC_PartlyCloudy0.gif' }, // Broken clouds
	'ovc': { day: 'CC_Cloudy.gif', night: 'CC_Cloudy.gif' },     // Overcast
	'novc': { day: 'CC_Cloudy.gif', night: 'CC_Cloudy.gif' },    // Night Overcast
	
	// Precipitation
	'rain': { day: 'CC_Rain.gif', night: 'CC_Rain.gif' },
	'rain_showers': { day: 'CC_Showers.gif', night: 'CC_Showers.gif' },
	'rain_showers_high': { day: 'CC_Showers.gif', night: 'CC_Showers.gif' },
	'snow': { day: 'CC_Snow.gif', night: 'CC_Snow.gif' },
	'sleet': { day: 'Sleet.gif', night: 'Sleet.gif' },
	'rain_sleet': { day: 'Sleet.gif', night: 'Sleet.gif' },
	'fzra': { day: 'CC_FreezingRain.gif', night: 'CC_FreezingRain.gif' },
	'rain_fzra': { day: 'CC_FreezingRain.gif', night: 'CC_FreezingRain.gif' },
	'snow_fzra': { day: 'CC_FreezingRain.gif', night: 'CC_FreezingRain.gif' },
	'rain_snow': { day: 'CC_RainSnow.gif', night: 'CC_RainSnow.gif' },
	'snow_sleet': { day: 'Snow-Sleet.gif', night: 'Snow-Sleet.gif' },
	
	// Thunderstorms
	'tsra': { day: 'EF_ScatTstorms.gif', night: 'CC_TStorm.gif' },
	'tsra_sct': { day: 'EF_ScatTstorms.gif', night: 'CC_TStorm.gif' },
	'tsra_hi': { day: 'CC_TStorm.gif', night: 'CC_TStorm.gif' },
	'hurricane': { day: 'CC_TStorm.gif', night: 'CC_TStorm.gif' },
	'tropical_storm': { day: 'CC_TStorm.gif', night: 'CC_TStorm.gif' },
	
	// Special conditions
	'fog': { day: 'CC_Fog.gif', night: 'CC_Fog.gif' },
	'wind_few': { day: 'CC_Windy.gif', night: 'CC_Windy.gif' },
	'wind_sct': { day: 'CC_Windy.gif', night: 'CC_Windy.gif' },
	'wind_bkn': { day: 'CC_Windy.gif', night: 'CC_Windy.gif' },
	'wind_ovc': { day: 'CC_Windy.gif', night: 'CC_Windy.gif' },
	'wind_skc': { day: 'CC_Windy.gif', night: 'CC_Windy.gif' },
	'wind': { day: 'CC_Windy.gif', night: 'CC_Windy.gif' },
	'blizzard': { day: 'Blowing-Snow.gif', night: 'Blowing-Snow.gif' }
};

// Simplified sunrise/sunset approximation for weather icon purposes
function getSunTimes(lat: number, lon: number, date: Date = new Date()) {
	const rad = Math.PI / 180;
	
	// Day of year
	const start = new Date(date.getFullYear(), 0, 1);
	const dayOfYear = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
	
	// Solar declination (simplified)
	const declination = -23.45 * Math.cos(2 * Math.PI * (dayOfYear + 10) / 365.25);
	const declinationRad = declination * rad;
	const latRad = lat * rad;
	
	// Hour angle for sunrise/sunset
	const cosHourAngle = -Math.tan(latRad) * Math.tan(declinationRad);
	
	// Handle extreme latitudes
	if (cosHourAngle > 1 || cosHourAngle < -1) {
		return { sunrise: null, sunset: null };
	}
	
	const hourAngle = Math.acos(cosHourAngle);
	
	// Base times in hours (no longitude correction for simplicity)
	const sunriseHours = 12 - hourAngle / (15 * rad);
	const sunsetHours = 12 + hourAngle / (15 * rad);
	
	// Create times for today
	const sunrise = new Date(date);
	sunrise.setHours(Math.floor(sunriseHours), Math.round((sunriseHours % 1) * 60), 0, 0);
	
	const sunset = new Date(date);
	sunset.setHours(Math.floor(sunsetHours), Math.round((sunsetHours % 1) * 60), 0, 0);
	
	return { sunrise, sunset };
}

function isNightTime(date?: Date, lat?: number, lon?: number): boolean {
	const now = date || new Date();
	
	// If coordinates are provided, use accurate sunrise/sunset calculation
	if (lat !== undefined && lon !== undefined) {
		const { sunrise, sunset } = getSunTimes(lat, lon, now);
		
		// Handle polar day/night cases
		if (!sunrise || !sunset) {
			// Fallback to simple logic for polar regions
			const hour = now.getHours();
			return hour < 6 || hour >= 20;
		}
		
		return now < sunrise || now > sunset;
	}
	
	// Fallback to simple hour-based logic
	const hour = now.getHours();
	return hour < 6 || hour >= 20;
}

export const getWeatherIcon = (
	iconUrl: string | null | undefined, 
	textDescription?: string | null,
	currentTime?: Date,
	lat?: number,
	lon?: number
): string | null => {
	if (!iconUrl) {
		// Fallback to text description parsing for legacy compatibility
		return getWeatherImageFromText(textDescription);
	}
	
	// Extract condition from NWS icon URL
	// Example: "https://api.weather.gov/icons/land/day/tsra_sct,40?size=medium"
	const match = iconUrl.match(/\/([^\/\?]+)(\?|$)/);
	if (!match) {
		console.warn('Unable to parse weather icon URL:', iconUrl);
		return getWeatherImageFromText(textDescription);
	}
	
	const conditionPart = match[1];
	
	// Handle compound conditions (e.g., "tsra_sct,40")
	const baseCondition = conditionPart.split(',')[0];
	
	// Determine day/night from URL path or time (with coordinates if available)
	const isNight = iconUrl.includes('/night/') || 
	                (currentTime && isNightTime(currentTime, lat, lon)) ||
	                isNightTime(undefined, lat, lon);
	
	// Debug logging
	if (lat !== undefined && lon !== undefined) {
		const now = new Date();
		const { sunrise, sunset } = getSunTimes(lat, lon, now);
		console.log('Weather Icon Debug:', {
			currentTime: now.toLocaleTimeString(),
			sunrise: sunrise.toLocaleTimeString(),
			sunset: sunset.toLocaleTimeString(),
			isNight,
			coordinates: { lat, lon },
			iconUrl,
			baseCondition
		});
	}
	
	// Get icon mapping
	const iconMap = weatherIconMap[baseCondition];
	if (!iconMap) {
		console.warn(`Unknown weather condition: ${baseCondition}, falling back to text description`);
		return getWeatherImageFromText(textDescription);
	}
	
	return `/images/${iconMap[isNight ? 'night' : 'day']}`;
};

// Legacy fallback function for text description parsing
const getWeatherImageFromText = (textDescription: string | null | undefined): string | null => {
	if (!textDescription || typeof textDescription !== 'string') {
		return null;
	}

	const weatherImageMap: { [key: string]: string } = {
		cloudy: 'CC_Cloudy.gif',
		rain: 'CC_Rain.gif',
		fog: 'CC_Fog.gif',
		partly_cloudy: 'CC_PartlyCloudy0.gif'
	};

	const precipitationKeywords = ['rain', 'drizzle', 'snow', 'thunderstorm'];
	const fogKeywords = ['fog', 'mist', 'haze'];
	const cloudKeywords = ['cloudy', 'partly_cloudy'];

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
			return `/${weatherImageMap[word] || 'CC_Rain.gif'}`;
		}
	}

	// Check for fog/mist/haze
	for (const word of words) {
		if (fogKeywords.includes(word)) {
			return `/${weatherImageMap[word] || 'CC_Fog.gif'}`;
		}
	}

	// Check for cloud coverage
	for (const word of words) {
		if (cloudKeywords.includes(word)) {
			return `/${weatherImageMap[word] || 'CC_Cloudy.gif'}`;
		}
	}

	// No match found, return null
	return null;
};

// Keep the old function name for backward compatibility
export const getWeatherImage = getWeatherIcon;
