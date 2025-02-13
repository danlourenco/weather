import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const parentData = await parent();
	const res = await fetch(parentData.location.observationStations);
	const data = await res.json();

	const stationApi = data.observationStations[0];
	console.log(stationApi);

	const results = await Promise.all([
		fetch(stationApi).then((res) => res.json()),
		fetch(`${stationApi}/observations/latest`).then((res) => res.json())
	]);

	return {
		station: results[0].properties,
		latestObservations: results[1].properties
	};
};
