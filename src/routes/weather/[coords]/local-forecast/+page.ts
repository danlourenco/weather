import type { PageLoad } from './$types';
import { weatherApi } from '$lib/services/api';
import type { LoaderResult } from '$lib/types/errors';
import { ErrorType } from '$lib/types/errors';

interface ForecastData {
	forecast: any[];
	hasForecast: boolean;
	coords: string;
}

export const load: PageLoad = async ({ parent }): Promise<LoaderResult<ForecastData>> => {
	const parentData = await parent();
	
	if (!parentData.location?.forecast) {
		return {
			data: null,
			error: {
				type: ErrorType.API_ERROR,
				message: 'No forecast URL available for this location',
				retryable: false
			}
		};
	}
	
	const forecastResult = await weatherApi.getForecast(parentData.location.forecast);
	
	if (forecastResult.error) {
		return {
			data: null,
			error: forecastResult.error
		};
	}
	
	const periods = forecastResult.data || [];
	
	return {
		data: {
			forecast: periods,
			hasForecast: periods.length > 0,
			coords: parentData.coords
		},
		error: null
	};
};
