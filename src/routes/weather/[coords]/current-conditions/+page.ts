import type { PageLoad } from './$types';
import { weatherApi } from '$lib/services/api';
import type { LoaderResult } from '$lib/types/errors';
import { ErrorType } from '$lib/types/errors';

interface CurrentConditionsData {
	station: any;
	latestObservations: any;
	hasData: boolean;
	coords: string;
}

export const load: PageLoad = async ({ parent }): Promise<LoaderResult<CurrentConditionsData>> => {
	const parentData = await parent();
	
	if (!parentData.location?.observationStations) {
		return {
			data: null,
			error: {
				type: ErrorType.API_ERROR,
				message: 'No observation stations available for this location',
				retryable: false
			}
		};
	}
	
	// Extract gridpoint from observation stations URL
	const stationsUrl = parentData.location.observationStations;
	const gridpointMatch = stationsUrl.match(/\/gridpoints\/([^\/]+\/[^\/]+)/);
	
	if (!gridpointMatch) {
		return {
			data: null,
			error: {
				type: ErrorType.API_ERROR,
				message: 'Invalid observation stations URL format',
				retryable: false
			}
		};
	}
	
	const gridpoint = gridpointMatch[1];
	const stationsResult = await weatherApi.getStations(gridpoint);
	
	if (stationsResult.error) {
		return {
			data: null,
			error: stationsResult.error
		};
	}
	
	if (!stationsResult.data || stationsResult.data.length === 0) {
		return {
			data: null,
			error: {
				type: ErrorType.NOT_FOUND,
				message: 'No weather stations found for this area',
				retryable: false
			}
		};
	}
	
	// Get the first station's ID
	const stationId = stationsResult.data[0]?.properties?.stationIdentifier;
	if (!stationId) {
		return {
			data: null,
			error: {
				type: ErrorType.API_ERROR,
				message: 'Invalid station data received',
				retryable: false
			}
		};
	}
	
	const observationsResult = await weatherApi.getLatestObservations(stationId);
	
	if (observationsResult.error) {
		return {
			data: null,
			error: observationsResult.error
		};
	}
	
	return {
		data: {
			station: stationsResult.data[0]?.properties || null,
			latestObservations: observationsResult.data || null,
			hasData: !!(stationsResult.data[0]?.properties && observationsResult.data),
			coords: parentData.coords
		},
		error: null
	};
};
