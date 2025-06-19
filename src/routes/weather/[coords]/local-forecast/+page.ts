import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	try {
		const parentData = await parent();
		
		if (!parentData.location?.forecast) {
			throw new Error('No forecast URL available from parent data');
		}
		
		const res = await fetch(parentData.location.forecast);
		
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		
		const data = await res.json();
		
		// Safe access to forecast periods with validation
		const periods = data.properties?.periods;
		if (!periods || !Array.isArray(periods)) {
			throw new Error('Invalid forecast data structure');
		}
		
		return {
			forecast: periods,
			hasForecast: periods.length > 0
		};
	} catch (error) {
		console.error('Failed to load forecast:', error);
		return {
			forecast: [],
			hasForecast: false,
			error: 'Failed to load weather forecast'
		};
	}
};
