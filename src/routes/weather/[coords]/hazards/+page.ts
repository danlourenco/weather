import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const hazards = await fetch(
		`https://api.weather.gov/alerts/active?point=${params.coords}&limit=5`
	);
	const json = await hazards.json();
	return {
		hazards: json.features[0].properties
	};
};
