export const load = async ({ params }) => {
	const [lat, lon] = params.coords.split(',');
	const res = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
	const data = await res.json();

	return {
		location: data.properties
	};
};
