/**
 * Weather data transformation service
 * Separates data processing logic from presentation components
 */

export interface Period {
	name: string;
	detailedForecast: string;
}

export interface WeatherObservation {
	temperature?: { value: number };
	textDescription?: string;
	relativeHumidity?: { value: number };
	dewpoint?: { value: number };
	visibility?: { value: number };
	windChill?: { value: number };
	presentWeather?: unknown[];
}

export interface WeatherStation {
	name?: string;
}

/**
 * Transform forecast periods into displayable strings
 */
export function transformForecastPeriods(periods: Period[]): string[] {
	if (!periods || !Array.isArray(periods)) {
		return [];
	}

	return periods.map((period: Period) => `${period.name}...${period.detailedForecast}`);
}

/**
 * Extract safe temperature value with fallback
 */
export function getSafeTemperature(
	observation: WeatherObservation,
	converter: (temp: number) => number
): number {
	const tempValue = observation?.temperature?.value;
	if (typeof tempValue !== 'number' || isNaN(tempValue)) {
		return 0;
	}
	return Math.round(converter(tempValue));
}

/**
 * Extract safe humidity value with fallback
 */
export function getSafeHumidity(observation: WeatherObservation): number {
	const humidity = observation?.relativeHumidity?.value;
	if (typeof humidity !== 'number' || isNaN(humidity)) {
		return 0;
	}
	return Math.round(humidity);
}

/**
 * Extract safe visibility value with fallback
 */
export function getSafeVisibility(
	observation: WeatherObservation,
	converter: (meters: number) => number
): number {
	const visibility = observation?.visibility?.value;
	if (typeof visibility !== 'number' || isNaN(visibility)) {
		return 0;
	}
	return converter(visibility);
}

/**
 * Extract safe text description with fallback
 */
export function getSafeTextDescription(observation: WeatherObservation): string {
	return observation?.textDescription || 'Unknown';
}

/**
 * Extract safe station name with fallback
 */
export function getSafeStationName(station: WeatherStation): string {
	const name = station?.name;
	if (!name) return 'Unknown Location';

	const parts = name.split(', ');
	return parts[1] || parts[0] || 'Unknown Location';
}

/**
 * Validate if weather observation data is complete
 */
export function isValidWeatherObservation(observation: WeatherObservation): boolean {
	return !!(
		observation &&
		typeof observation.temperature?.value === 'number' &&
		!isNaN(observation.temperature.value)
	);
}

/**
 * Validate if station data is complete
 */
export function isValidWeatherStation(station: WeatherStation): boolean {
	return !!(station && station.name);
}

/**
 * Transform hazard data with safe access
 */
export function transformHazardDetails(description?: string): string[] {
	if (!description || typeof description !== 'string') {
		return [];
	}
	return description.split('\n\n').filter((detail) => detail.trim().length > 0);
}
