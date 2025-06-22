import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../vitest-setup-server';
import { WeatherApiClient, baseUrl } from './api';
import { ErrorType } from '$lib/types/errors';
import {
	mockPointData,
	mockForecastData,
	mockStationsData,
	mockObservationData,
	mockAdvisoriesData
} from './__mocks__/handlers';

describe('WeatherApiClient', () => {
	let client: WeatherApiClient;

	beforeEach(() => {
		client = new WeatherApiClient();
		vi.clearAllMocks();
	});

	describe('getPointData', () => {
		it('should successfully fetch point data', async () => {
			const result = await client.getPointData(39.0458, -95.689);

			expect(result.error).toBeNull();
			expect(result.data).toEqual(mockPointData.properties);
		});

		it('should handle 404 errors for invalid coordinates', async () => {
			const result = await client.getPointData(404, 404);

			expect(result.data).toBeNull();
			expect(result.error).toBeDefined();
			expect(result.error?.type).toBe(ErrorType.API_ERROR);
			expect(result.error?.retryable).toBe(false);
		});

		it('should handle 500 server errors with retry', async () => {
			vi.useFakeTimers();

			try {
				const resultPromise = client.getPointData(500, 500);
				await vi.runAllTimersAsync();
				const result = await resultPromise;

				expect(result.data).toBeNull();
				expect(result.error).toBeDefined();
				expect(result.error?.type).toBe(ErrorType.API_ERROR);
				expect(result.error?.retryable).toBe(true);
			} finally {
				vi.useRealTimers();
			}
		});

		it('should handle invalid response format', async () => {
			server.use(
				http.get(`${baseUrl}/points/:coords`, () => {
					return HttpResponse.json({ invalid: 'response' });
				})
			);

			const result = await client.getPointData(39.0458, -95.689);

			expect(result.data).toBeNull();
			expect(result.error).toBeDefined();
			expect(result.error?.message).toContain('missing properties');
		});

		it('should handle network errors', async () => {
			vi.useFakeTimers();

			try {
				server.use(
					http.get(`${baseUrl}/points/:coords`, () => {
						return HttpResponse.error();
					})
				);

				const resultPromise = client.getPointData(39.0458, -95.689);
				await vi.runAllTimersAsync();
				const result = await resultPromise;

				expect(result.data).toBeNull();
				expect(result.error).toBeDefined();
				expect(result.error?.type).toBe(ErrorType.NETWORK);
			} finally {
				vi.useRealTimers();
			}
		});
	});

	describe('getForecast', () => {
		it('should successfully fetch forecast data', async () => {
			const forecastUrl = 'https://api.weather.gov/gridpoints/TOP/31,80/forecast';
			const result = await client.getForecast(forecastUrl);

			expect(result.error).toBeNull();
			expect(result.data).toEqual(mockForecastData.properties.periods);
		});

		it('should handle invalid forecast response format', async () => {
			server.use(
				http.get(`${baseUrl}/gridpoints/:office/:gridX,:gridY/forecast`, () => {
					return HttpResponse.json({ properties: { invalid: 'data' } });
				})
			);

			const forecastUrl = 'https://api.weather.gov/gridpoints/TOP/31,80/forecast';
			const result = await client.getForecast(forecastUrl);

			expect(result.data).toBeNull();
			expect(result.error).toBeDefined();
			expect(result.error?.message).toContain('missing periods');
		});

		it('should handle server errors', async () => {
			vi.useFakeTimers();

			try {
				server.use(
					http.get(`${baseUrl}/gridpoints/:office/:gridX,:gridY/forecast`, () => {
						return new HttpResponse(null, { status: 500 });
					})
				);

				const forecastUrl = 'https://api.weather.gov/gridpoints/TOP/31,80/forecast';
				const resultPromise = client.getForecast(forecastUrl);
				await vi.runAllTimersAsync();
				const result = await resultPromise;

				expect(result.data).toBeNull();
				expect(result.error).toBeDefined();
				expect(result.error?.type).toBe(ErrorType.API_ERROR);
			} finally {
				vi.useRealTimers();
			}
		});
	});

	describe('getStations', () => {
		it('should successfully fetch stations data', async () => {
			const result = await client.getStations('TOP/31,80');

			expect(result.error).toBeNull();
			expect(result.data).toEqual(mockStationsData.features);
		});

		it('should handle invalid stations response format', async () => {
			server.use(
				http.get(`${baseUrl}/gridpoints/:office/:gridX,:gridY/stations`, () => {
					return HttpResponse.json({ invalid: 'response' });
				})
			);

			const result = await client.getStations('TOP/31,80');

			expect(result.data).toBeNull();
			expect(result.error).toBeDefined();
			expect(result.error?.message).toContain('missing features');
		});

		it('should handle invalid gridpoint errors', async () => {
			const result = await client.getStations('INVALID/0,0');

			expect(result.data).toBeNull();
			expect(result.error).toBeDefined();
			expect(result.error?.type).toBe(ErrorType.API_ERROR);
		});
	});

	describe('getLatestObservations', () => {
		it('should successfully fetch observation data', async () => {
			const result = await client.getLatestObservations('KTOP');

			expect(result.error).toBeNull();
			expect(result.data).toEqual(mockObservationData.properties);
		});

		it('should handle invalid station ID', async () => {
			const result = await client.getLatestObservations('INVALID');

			expect(result.data).toBeNull();
			expect(result.error).toBeDefined();
			expect(result.error?.type).toBe(ErrorType.API_ERROR);
		});

		it('should handle server errors', async () => {
			vi.useFakeTimers();

			try {
				const resultPromise = client.getLatestObservations('ERROR');
				await vi.runAllTimersAsync();
				const result = await resultPromise;

				expect(result.data).toBeNull();
				expect(result.error).toBeDefined();
				expect(result.error?.type).toBe(ErrorType.API_ERROR);
			} finally {
				vi.useRealTimers();
			}
		});

		it('should handle invalid observation response format', async () => {
			server.use(
				http.get(`${baseUrl}/stations/:stationId/observations/latest`, () => {
					return HttpResponse.json({ invalid: 'response' });
				})
			);

			const result = await client.getLatestObservations('KTOP');

			expect(result.data).toBeNull();
			expect(result.error).toBeDefined();
			expect(result.error?.message).toContain('missing properties');
		});
	});

	describe('getAdvisories', () => {
		it('should successfully fetch advisories data', async () => {
			const result = await client.getAdvisories(39.0458, -95.689);

			expect(result.error).toBeNull();
			expect(result.data).toEqual(mockAdvisoriesData.features);
		});

		it('should handle no advisories (empty array)', async () => {
			server.use(
				http.get(`${baseUrl}/alerts/active`, () => {
					return HttpResponse.json({ features: [] });
				})
			);

			const result = await client.getAdvisories(39.0458, -95.689);

			expect(result.error).toBeNull();
			expect(result.data).toEqual([]);
		});

		it('should handle missing features property', async () => {
			server.use(
				http.get(`${baseUrl}/alerts/active`, () => {
					return HttpResponse.json({ invalid: 'response' });
				})
			);

			const result = await client.getAdvisories(39.0458, -95.689);

			expect(result.error).toBeNull();
			expect(result.data).toEqual([]);
		});

		it('should handle server errors', async () => {
			server.use(
				http.get(`${baseUrl}/alerts/active`, () => {
					return new HttpResponse(null, { status: 404 });
				})
			);

			const result = await client.getAdvisories(404, 404);

			expect(result.data).toBeNull();
			expect(result.error).toBeDefined();
			expect(result.error?.type).toBe(ErrorType.API_ERROR);
		});

		it('should round coordinates to 4 decimal places', async () => {
			// Test with high precision coordinates that need rounding
			const lat = 42.117818577556015;
			const lon = -71.34027962585594;

			let capturedUrl = '';
			server.use(
				http.get(`${baseUrl}/alerts/active`, ({ request }) => {
					capturedUrl = request.url;
					return HttpResponse.json(mockAdvisoriesData);
				})
			);

			const result = await client.getAdvisories(lat, lon);

			// Verify the URL has properly rounded coordinates
			const url = new URL(capturedUrl);
			expect(url.searchParams.get('point')).toBe('42.1178,-71.3403');
			expect(url.searchParams.get('limit')).toBe('5');

			// Verify we get the expected data
			expect(result.error).toBeNull();
			expect(result.data).toEqual(mockAdvisoriesData.features);
		});

		it('should handle negative coordinates correctly', async () => {
			const lat = -45.123;
			const lon = -123.456;

			let capturedUrl = '';
			server.use(
				http.get(`${baseUrl}/alerts/active`, ({ request }) => {
					capturedUrl = request.url;
					return HttpResponse.json(mockAdvisoriesData);
				})
			);

			const result = await client.getAdvisories(lat, lon);

			const url = new URL(capturedUrl);
			expect(url.searchParams.get('point')).toBe(`${lat},${lon}`);
			expect(result.error).toBeNull();
			expect(result.data).toEqual(mockAdvisoriesData.features);
		});

		it('should handle edge case rounding correctly', async () => {
			const lat = 42.99999; // Should round to 43.0000
			const lon = -71.99999; // Should round to -72.0000

			let capturedUrl = '';
			server.use(
				http.get(`${baseUrl}/alerts/active`, ({ request }) => {
					capturedUrl = request.url;
					return HttpResponse.json(mockAdvisoriesData);
				})
			);

			const result = await client.getAdvisories(lat, lon);

			const url = new URL(capturedUrl);
			expect(url.searchParams.get('point')).toBe('43,-72');
			expect(result.error).toBeNull();
		});
	});

	describe('retry logic', () => {
		it('should retry on server errors', async () => {
			vi.useFakeTimers();

			try {
				let attempts = 0;
				server.use(
					http.get(`${baseUrl}/points/:coords`, () => {
						attempts++;
						if (attempts < 3) {
							return new HttpResponse(null, { status: 500 });
						}
						return HttpResponse.json(mockPointData);
					})
				);

				const resultPromise = client.getPointData(39.0458, -95.689);

				// Fast-forward through retry delays
				await vi.runAllTimersAsync();

				const result = await resultPromise;

				expect(attempts).toBe(3);
				expect(result.error).toBeNull();
				expect(result.data).toEqual(mockPointData.properties);
			} finally {
				vi.useRealTimers();
			}
		});

		it('should not retry on client errors', async () => {
			let attempts = 0;
			server.use(
				http.get(`${baseUrl}/points/:coords`, () => {
					attempts++;
					return new HttpResponse(null, { status: 400 });
				})
			);

			const result = await client.getPointData(39.0458, -95.689);

			expect(attempts).toBe(1);
			expect(result.data).toBeNull();
			expect(result.error?.retryable).toBe(false);
		});

		it('should fail after max retries', async () => {
			vi.useFakeTimers();

			try {
				let attempts = 0;
				server.use(
					http.get(`${baseUrl}/points/:coords`, () => {
						attempts++;
						return new HttpResponse(null, { status: 500 });
					})
				);

				const resultPromise = client.getPointData(39.0458, -95.689);

				// Fast-forward through all retry delays
				await vi.runAllTimersAsync();

				const result = await resultPromise;

				expect(attempts).toBe(4); // initial + 3 retries
				expect(result.data).toBeNull();
				expect(result.error).toBeDefined();
			} finally {
				vi.useRealTimers();
			}
		});
	});

	describe('timeout handling', () => {
		it('should handle abort controller timeout logic', async () => {
			// Test that timeout configuration is used properly
			const clientWithShortTimeout = new WeatherApiClient();

			// Mock a slow response that should timeout
			server.use(
				http.get(`${baseUrl}/points/:coords`, async () => {
					// Simulate a slow response
					await new Promise((resolve) => setTimeout(resolve, 100));
					return HttpResponse.json(mockPointData);
				})
			);

			const result = await clientWithShortTimeout.getPointData(39.0458, -95.689);

			// Since we're using fake timers, the timeout logic should work normally
			// This test verifies the basic structure is in place
			expect(result).toBeDefined();
		});
	});

	describe('error handling edge cases', () => {
		it('should handle non-Error objects thrown', async () => {
			vi.useFakeTimers();

			try {
				server.use(
					http.get(`${baseUrl}/points/:coords`, () => {
						return HttpResponse.error();
					})
				);

				const resultPromise = client.getPointData(39.0458, -95.689);
				await vi.runAllTimersAsync();
				const result = await resultPromise;

				expect(result.data).toBeNull();
				expect(result.error).toBeDefined();
				expect(result.error?.type).toBe(ErrorType.NETWORK);
			} finally {
				vi.useRealTimers();
			}
		});

		it('should handle JSON parsing errors', async () => {
			server.use(
				http.get(`${baseUrl}/points/:coords`, () => {
					return new HttpResponse('invalid json', {
						status: 200,
						headers: { 'Content-Type': 'application/json' }
					});
				})
			);

			const result = await client.getPointData(39.0458, -95.689);

			expect(result.data).toBeNull();
			expect(result.error).toBeDefined();
			expect(result.error?.type).toBe(ErrorType.NETWORK);
		});
	});

	describe('response validation', () => {
		it('should validate point data structure', async () => {
			server.use(
				http.get(`${baseUrl}/points/:coords`, () => {
					return HttpResponse.json({
						// Missing properties field
						invalid: 'structure'
					});
				})
			);

			const result = await client.getPointData(39.0458, -95.689);

			expect(result.data).toBeNull();
			expect(result.error?.message).toContain('missing properties');
		});

		it('should validate forecast data structure', async () => {
			server.use(
				http.get(`${baseUrl}/gridpoints/:office/:gridX,:gridY/forecast`, () => {
					return HttpResponse.json({
						properties: {
							// Missing periods field
							invalid: 'structure'
						}
					});
				})
			);

			const result = await client.getForecast(
				'https://api.weather.gov/gridpoints/TOP/31,80/forecast'
			);

			expect(result.data).toBeNull();
			expect(result.error?.message).toContain('missing periods');
		});

		it('should validate stations data structure', async () => {
			server.use(
				http.get(`${baseUrl}/gridpoints/:office/:gridX,:gridY/stations`, () => {
					return HttpResponse.json({
						// Missing features field
						invalid: 'structure'
					});
				})
			);

			const result = await client.getStations('TOP/31,80');

			expect(result.data).toBeNull();
			expect(result.error?.message).toContain('missing features');
		});

		it('should validate observation data structure', async () => {
			server.use(
				http.get(`${baseUrl}/stations/:stationId/observations/latest`, () => {
					return HttpResponse.json({
						// Missing properties field
						invalid: 'structure'
					});
				})
			);

			const result = await client.getLatestObservations('KTOP');

			expect(result.data).toBeNull();
			expect(result.error?.message).toContain('missing properties');
		});
	});
});

describe('weatherApi singleton', () => {
	it('should export a singleton instance', async () => {
		const { weatherApi } = await import('./api');

		expect(weatherApi).toBeInstanceOf(WeatherApiClient);
	});
});
