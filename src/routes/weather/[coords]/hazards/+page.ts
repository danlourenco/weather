import type { PageLoad } from './$types';
import { weatherApi } from '$lib/services/api';
import type { LoaderResult } from '$lib/types/errors';
import { ErrorType } from '$lib/types/errors';

interface HazardsData {
	hazards: any[];
	hasHazards: boolean;
	coords: string;
}

export const load: PageLoad = async ({ parent }): Promise<LoaderResult<HazardsData>> => {
	const parentData = await parent();

	// Extract coordinates from parent data
	const coords = parentData.coords?.split(',');
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

	const [lat, lon] = coords.map(Number);

	if (isNaN(lat) || isNaN(lon)) {
		return {
			data: null,
			error: {
				type: ErrorType.VALIDATION,
				message: 'Invalid coordinate values',
				retryable: false
			}
		};
	}

	const advisoriesResult = await weatherApi.getAdvisories(lat, lon);

	if (advisoriesResult.error) {
		return {
			data: null,
			error: advisoriesResult.error
		};
	}

	// Get all hazards, not just the first one
	const hazards =
		advisoriesResult.data?.map((advisory: any) => advisory.properties).filter(Boolean) || [];

	return {
		data: {
			hazards,
			hasHazards: hazards.length > 0,
			coords: parentData.coords
		},
		error: null
	};
};
