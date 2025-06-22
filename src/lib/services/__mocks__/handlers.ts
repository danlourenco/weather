import { http, HttpResponse } from 'msw';
import { baseUrl } from '../api';

export const mockPointData = {
	properties: {
		cwa: 'TOP',
		forecastOffice: 'https://api.weather.gov/offices/TOP',
		gridId: 'TOP',
		gridX: 31,
		gridY: 80,
		forecast: 'https://api.weather.gov/gridpoints/TOP/31,80/forecast',
		forecastHourly: 'https://api.weather.gov/gridpoints/TOP/31,80/forecast/hourly',
		observationStations: 'https://api.weather.gov/gridpoints/TOP/31,80/stations',
		relativeLocation: {
			properties: {
				city: 'Topeka',
				state: 'KS'
			}
		}
	}
};

export const mockForecastData = {
	properties: {
		periods: [
			{
				number: 1,
				name: 'Today',
				startTime: '2023-12-07T06:00:00-06:00',
				endTime: '2023-12-07T18:00:00-06:00',
				isDaytime: true,
				temperature: 45,
				temperatureUnit: 'F',
				temperatureTrend: null,
				windSpeed: '5 mph',
				windDirection: 'S',
				icon: 'https://api.weather.gov/icons/land/day/few?size=medium',
				shortForecast: 'Sunny',
				detailedForecast: 'Sunny, with a high near 45.'
			}
		]
	}
};

export const mockStationsData = {
	features: [
		{
			properties: {
				stationIdentifier: 'KTOP',
				name: 'Topeka Regional Airport'
			}
		},
		{
			properties: {
				stationIdentifier: 'K9K7',
				name: 'Topeka / Forbes Field'
			}
		}
	]
};

export const mockObservationData = {
	properties: {
		timestamp: '2023-12-07T18:53:00+00:00',
		textDescription: 'Fair',
		icon: 'https://api.weather.gov/icons/land/day/skc?size=medium',
		temperature: {
			value: 7.2,
			unitCode: 'wmoUnit:degC'
		},
		dewpoint: {
			value: -15.0,
			unitCode: 'wmoUnit:degC'
		},
		windDirection: {
			value: 180,
			unitCode: 'wmoUnit:degree_(angle)'
		},
		windSpeed: {
			value: 2.6,
			unitCode: 'wmoUnit:m_s-1'
		},
		relativeHumidity: {
			value: 31.5,
			unitCode: 'wmoUnit:percent'
		},
		visibility: {
			value: 16090,
			unitCode: 'wmoUnit:m'
		}
	}
};

export const mockAdvisoriesData = {
	features: [
		{
			properties: {
				id: 'https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.123',
				event: 'Winter Weather Advisory',
				headline: 'Winter Weather Advisory issued December 7 at 3:21PM CST',
				description: 'Snow expected. Total snow accumulations of 2 to 4 inches.',
				severity: 'Moderate',
				certainty: 'Likely'
			}
		}
	]
};

export const weatherApiHandlers = [
	// Point data endpoint
	http.get(`${baseUrl}/points/:coords`, ({ params }) => {
		const coords = params.coords as string;

		if (coords === '404,404') {
			return new HttpResponse(null, { status: 404 });
		}

		if (coords === '500,500') {
			return new HttpResponse(null, { status: 500 });
		}

		if (coords === 'invalid,coords') {
			return HttpResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
		}

		return HttpResponse.json(mockPointData);
	}),

	// Forecast endpoint
	http.get(`${baseUrl}/gridpoints/:office/:gridX,:gridY/forecast`, () => {
		return HttpResponse.json(mockForecastData);
	}),

	// Stations endpoint
	http.get(`${baseUrl}/gridpoints/:office/:gridX,:gridY/stations`, ({ params }) => {
		const office = params.office as string;
		const gridX = params.gridX as string;
		const gridY = params.gridY as string;

		if (office === 'INVALID' && gridX === '0' && gridY === '0') {
			return HttpResponse.json({ error: 'Invalid gridpoint' }, { status: 400 });
		}

		return HttpResponse.json(mockStationsData);
	}),

	// Latest observations endpoint
	http.get(`${baseUrl}/stations/:stationId/observations/latest`, ({ params }) => {
		const stationId = params.stationId as string;

		if (stationId === 'INVALID') {
			return new HttpResponse(null, { status: 404 });
		}

		if (stationId === 'ERROR') {
			return new HttpResponse(null, { status: 500 });
		}

		return HttpResponse.json(mockObservationData);
	}),

	// Advisories endpoint
	http.get(`${baseUrl}/alerts/active`, ({ request }) => {
		const url = new URL(request.url);
		const point = url.searchParams.get('point');

		if (point === '404,404') {
			return new HttpResponse(null, { status: 404 });
		}

		return HttpResponse.json(mockAdvisoriesData);
	}),

	// Generic error handlers for network simulation
	http.get(`${baseUrl}/timeout`, () => {
		// Simulate a timeout by never resolving
		return new Promise(() => {});
	}),

	http.get(`${baseUrl}/network-error`, () => {
		return HttpResponse.error();
	})
];
