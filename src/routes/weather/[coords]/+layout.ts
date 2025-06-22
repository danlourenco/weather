import { weatherApi } from '$lib/services/api';
import { createValidationError } from '$lib/types/errors';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	// Validate coordinates format
	const coords = params.coords?.split?.(',');
	if (!coords || coords.length !== 2) {
		throw error(400, createValidationError('Invalid coordinates format: expected "lat,lon"'));
	}
	
	const [lat, lon] = coords;
	
	// Validate coordinate values
	const latNum = parseFloat(lat);
	const lonNum = parseFloat(lon);
	if (isNaN(latNum) || isNaN(lonNum)) {
		throw error(400, createValidationError('Invalid coordinate values: must be valid numbers'));
	}
	
	// Validate coordinate ranges
	if (latNum < -90 || latNum > 90) {
		throw error(400, createValidationError('Invalid latitude: must be between -90 and 90'));
	}
	if (lonNum < -180 || lonNum > 180) {
		throw error(400, createValidationError('Invalid longitude: must be between -180 and 180'));
	}
	
	const result = await weatherApi.getPointData(latNum, lonNum);
	
	if (result.error) {
		const statusCode = result.error.statusCode || 500;
		throw error(statusCode, result.error.message);
	}
	
	if (!result.data) {
		throw error(404, 'No weather data available for this location');
	}

	return {
		location: result.data,
		coords: `${lat},${lon}`
	};
};
