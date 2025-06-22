import type { PageLoad } from './$types';
import { weatherApi } from '$lib/services/api';
import type { LoaderResult } from '$lib/types/errors';
import { ErrorType } from '$lib/types/errors';

interface HazardsData {
	hazards: any;
	hasHazards: boolean;
	coords: string;
}

export const load: PageLoad = async ({ params }): Promise<LoaderResult<HazardsData>> => {
	const coords = params.coords?.split(',');
	if (!coords || coords.length !== 2) {
		return {
			data: null,
			error: {
				type: ErrorType.VALIDATION,
				message: 'Invalid coordinates format',
				retryable: false
			}
		};
	}
	
	const [lat, lon] = coords;
	const latNum = parseFloat(lat);
	const lonNum = parseFloat(lon);
	
	if (isNaN(latNum) || isNaN(lonNum)) {
		return {
			data: null,
			error: {
				type: ErrorType.VALIDATION,
				message: 'Invalid coordinate values',
				retryable: false
			}
		};
	}
	
	const advisoriesResult = await weatherApi.getAdvisories(latNum, lonNum);
	
	if (advisoriesResult.error) {
		return {
			data: null,
			error: advisoriesResult.error
		};
	}
	
	const hazardData = advisoriesResult.data?.[0]?.properties || null;
	
	return {
		data: {
			hazards: hazardData,
			hasHazards: hazardData !== null,
			coords: `${lat},${lon}`
		},
		error: null
	};
};
