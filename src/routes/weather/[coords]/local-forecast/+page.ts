import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const parentData = await parent();
	console.log(parentData);
	const res = await fetch(parentData.location.forecast);
	const data = await res.json();
	return {
		forecast: data.properties.periods
	};
};
