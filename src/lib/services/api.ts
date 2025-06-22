import {
	WeatherError,
	createNetworkError,
	createApiError,
	createTimeoutError,
	type LoaderResult
} from '$lib/types/errors';

interface RetryOptions {
	maxRetries?: number;
	baseDelay?: number;
	maxDelay?: number;
	timeout?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
	maxRetries: 3,
	baseDelay: 1000,
	maxDelay: 10000,
	timeout: 30000
};

export const baseUrl = 'https://api.weather.gov';

export class WeatherApiClient {
	private async fetchWithRetry(
		url: string,
		options: RequestInit = {},
		retryOptions: RetryOptions = {}
	): Promise<Response> {
		const config = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
		let lastError: Error | null = null;

		for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), config.timeout);

				const response = await fetch(url, {
					...options,
					signal: controller.signal
				});

				clearTimeout(timeoutId);

				if (response.ok) {
					return response;
				}

				if (response.status >= 400 && response.status < 500) {
					throw createApiError(
						`Client error: ${response.status} ${response.statusText}`,
						response.status
					);
				}

				if (response.status >= 500) {
					throw createApiError(
						`Server error: ${response.status} ${response.statusText}`,
						response.status
					);
				}

				throw createNetworkError(
					`HTTP error: ${response.status} ${response.statusText}`,
					response.status
				);
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));

				if (error instanceof WeatherError && !error.retryable) {
					throw error;
				}

				if (error instanceof DOMException && error.name === 'AbortError') {
					lastError = createTimeoutError(`Request timeout after ${config.timeout}ms`);
				}

				if (attempt === config.maxRetries) {
					break;
				}

				const delay = Math.min(config.baseDelay * Math.pow(2, attempt), config.maxDelay);

				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}

		if (lastError instanceof WeatherError) {
			throw lastError;
		}

		throw createNetworkError(
			`Request failed after ${config.maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`
		);
	}

	private async safeApiCall<T>(apiCall: () => Promise<T>): Promise<LoaderResult<T>> {
		try {
			const data = await apiCall();
			return { data, error: null };
		} catch (error) {
			console.error('API call failed:', error);

			if (error instanceof WeatherError) {
				return { data: null, error: error.toAppError() };
			}

			return {
				data: null,
				error: createNetworkError(
					error instanceof Error ? error.message : 'Unknown error occurred'
				).toAppError()
			};
		}
	}

	async getPointData(lat: number, lon: number): Promise<LoaderResult<any>> {
		return this.safeApiCall(async () => {
			// Round coordinates to 4 decimal places to match NWS API expectations
			const roundedLat = Math.round(lat * 10000) / 10000;
			const roundedLon = Math.round(lon * 10000) / 10000;

			const response = await this.fetchWithRetry(`${baseUrl}/points/${roundedLat},${roundedLon}`);
			const data = await response.json();

			if (!data.properties) {
				throw createApiError('Invalid response from weather API: missing properties');
			}

			return data.properties;
		});
	}

	async getForecast(forecastUrl: string): Promise<LoaderResult<any>> {
		return this.safeApiCall(async () => {
			const response = await this.fetchWithRetry(forecastUrl);
			const data = await response.json();

			if (!data.properties?.periods) {
				throw createApiError('Invalid forecast data: missing periods');
			}

			return data.properties.periods;
		});
	}

	async getStations(gridpoint: string): Promise<LoaderResult<any>> {
		return this.safeApiCall(async () => {
			const response = await this.fetchWithRetry(`${baseUrl}/gridpoints/${gridpoint}/stations`);
			const data = await response.json();

			if (!data.features) {
				throw createApiError('Invalid stations data: missing features');
			}

			return data.features;
		});
	}

	async getLatestObservations(stationId: string): Promise<LoaderResult<any>> {
		return this.safeApiCall(async () => {
			const response = await this.fetchWithRetry(
				`${baseUrl}/stations/${stationId}/observations/latest`
			);
			const data = await response.json();

			if (!data.properties) {
				throw createApiError('Invalid observation data: missing properties');
			}

			return data.properties;
		});
	}

	async getAdvisories(lat: number, lon: number): Promise<LoaderResult<any>> {
		return this.safeApiCall(async () => {
			// Round coordinates to 4 decimal places to match NWS API expectations
			const roundedLat = Math.round(lat * 10000) / 10000;
			const roundedLon = Math.round(lon * 10000) / 10000;

			// Construct URL manually to avoid encoding the comma in coordinates
			const url = `${baseUrl}/alerts/active?point=${roundedLat},${roundedLon}`;

			const response = await this.fetchWithRetry(url);
			const data = await response.json();

			return data.features || [];
		});
	}
}

export const weatherApi = new WeatherApiClient();
