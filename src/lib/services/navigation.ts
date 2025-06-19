import { goto } from '$app/navigation';

/**
 * Centralized navigation service for weather routes
 */
export class WeatherNavigation {
	/**
	 * Navigate to the current conditions page for given coordinates
	 */
	static goToCurrentConditions(coords: string): void {
		goto(`/weather/${coords}/current-conditions`);
	}

	/**
	 * Navigate to the local forecast page for given coordinates
	 */
	static goToLocalForecast(coords: string): void {
		goto(`/weather/${coords}/local-forecast`);
	}

	/**
	 * Navigate to the weather hazards page for given coordinates
	 */
	static goToHazards(coords: string): void {
		goto(`/weather/${coords}/hazards`);
	}

	/**
	 * Navigate to the weather video intro page for given coordinates
	 */
	static goToWeatherIntro(coords: string): void {
		goto(`/weather/${coords}`);
	}

	/**
	 * Navigate to the test page for given coordinates
	 */
	static goToTest(coords: string): void {
		goto(`/weather/${coords}/test`);
	}

	/**
	 * Get the URL for a specific weather route without navigating
	 */
	static getWeatherUrl(coords: string, route: 'current-conditions' | 'local-forecast' | 'hazards' | 'test' | ''): string {
		const routeSegment = route ? `/${route}` : '';
		return `/weather/${coords}${routeSegment}`;
	}
}