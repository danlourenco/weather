import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	try {
		const hazards = await fetch(
			`https://api.weather.gov/alerts/active?point=${params.coords}&limit=5`
		);
		
		if (!hazards.ok) {
			throw new Error(`HTTP error! status: ${hazards.status}`);
		}
		
		const json = await hazards.json();
		
		// Safe array access with fallback
		const hazardData = json.features?.[0]?.properties || null;
		
		return {
			hazards: hazardData,
			hasHazards: hazardData !== null
		};
	} catch (error) {
		console.error('Failed to load hazards:', error);
		return {
			hazards: null,
			hasHazards: false,
			error: 'Failed to load weather hazards'
		};
	}
};
