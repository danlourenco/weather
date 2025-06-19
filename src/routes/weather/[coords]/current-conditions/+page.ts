import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	try {
		const parentData = await parent();
		
		if (!parentData.location?.observationStations) {
			throw new Error('No observation stations available');
		}
		
		const res = await fetch(parentData.location.observationStations);
		
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		
		const data = await res.json();
		
		// Safe array access with validation
		const stationApi = data.observationStations?.[0];
		if (!stationApi) {
			throw new Error('No observation stations found in response');
		}

		const results = await Promise.all([
			fetch(stationApi).then((res) => {
				if (!res.ok) throw new Error(`Station API error: ${res.status}`);
				return res.json();
			}),
			fetch(`${stationApi}/observations/latest`).then((res) => {
				if (!res.ok) throw new Error(`Observations API error: ${res.status}`);
				return res.json();
			})
		]);

		return {
			station: results[0]?.properties || null,
			latestObservations: results[1]?.properties || null,
			hasData: !!(results[0]?.properties && results[1]?.properties)
		};
	} catch (error) {
		console.error('Failed to load current conditions:', error);
		return {
			station: null,
			latestObservations: null,
			hasData: false,
			error: 'Failed to load current weather conditions'
		};
	}
};
