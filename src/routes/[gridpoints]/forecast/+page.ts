import { error } from '@sveltejs/kit';
import type { PageLoad } from '../../$types';
export const load: PageLoad = async ({ fetch, params }) => {
	const res = await fetch('https://api.weather.gov/gridpoints/BOX/64,77/forecast?units=us');
	const data = await res.json();
	console.log(data.properties.periods);
	return {
		forecast: data.properties.periods
	};
};
