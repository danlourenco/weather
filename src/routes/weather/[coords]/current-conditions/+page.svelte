<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	import ClickableWeatherCard from '$lib/components/ClickableWeatherCard.svelte';
	import WeatherDataGrid from '$lib/components/WeatherDataGrid.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import { celsiusToFahrenheit, metersToMiles, getWeatherIcon, formatWind } from '$lib';
	import { WeatherNavigation } from '$lib/services/navigation';
	import {
		getSafeTemperature,
		getSafeHumidity,
		getSafeVisibility,
		getSafeTextDescription,
		getSafeStationName,
		isValidWeatherObservation,
		isValidWeatherStation
	} from '$lib/services/weatherTransforms';

	const goToLocalForecast = () => {
		WeatherNavigation.goToLocalForecast(data.data?.coords || '');
	};

	// Transform weather data using service
	const observation = data.data?.latestObservations;
	console.log(observation);
	const station = data.data?.station;

	const temperature = getSafeTemperature(observation, celsiusToFahrenheit);
	const textDescription = getSafeTextDescription(observation);
	const humidity = getSafeHumidity(observation);
	const dewpoint = getSafeTemperature({ temperature: observation?.dewpoint }, celsiusToFahrenheit);
	const visibility = getSafeVisibility(observation, metersToMiles);
	const windChill = getSafeTemperature(
		{ temperature: observation?.windChill },
		celsiusToFahrenheit
	);
	const stationName = getSafeStationName(station);

	const hasValidData =
		data.data?.hasData && isValidWeatherObservation(observation) && isValidWeatherStation(station);

	// Extract coordinates for sunrise/sunset calculation
	const [lat, lon] = data.data?.coords
		? data.data.coords.split(',').map(Number)
		: [undefined, undefined];

	const weatherImage = hasValidData
		? getWeatherIcon(
				observation?.icon,
				observation?.textDescription,
				undefined, // currentTime - use default (now)
				lat,
				lon
			)
		: null;

	// Format wind display
	const windDisplay = hasValidData
		? formatWind(observation?.windDirection?.value, observation?.windSpeed?.value)
		: '';

	// Prepare data grid items
	const weatherDataItems = [
		{ label: 'Humidity', value: humidity, unit: '%' },
		{ label: 'Dewpoint', value: dewpoint, unit: '°' },
		{ label: 'Visibility', value: visibility, unit: ' mi.' },
		{ label: 'Wind Chill', value: windChill, unit: '°' }
	];
</script>

<div id="current-conditions">
	<ClickableWeatherCard title="Current Conditions" onclick={goToLocalForecast}>
		{#if hasValidData}
			<div class="flex flex-row justify-between">
				<div class="flex w-1/2 flex-col text-center">
					<div>{temperature}°F</div>
					<div class="font-[Star4000Extended] text-4xl">
						{textDescription}
					</div>
					<div class="justify-items-center">
						{#if weatherImage}
							<img src={weatherImage} alt="Current weather condition Image" class="weather-icon" />
						{/if}
						{#if windDisplay}
							<div class="text-lg mt-2">Wind: {windDisplay}</div>
						{/if}
					</div>
				</div>
				<div>
					<h2 class="text-title-yellow up mb-2 text-2xl normal-case">
						{stationName}
					</h2>
					<WeatherDataGrid items={weatherDataItems} />
				</div>
			</div>
		{:else if data.error}
			<ErrorState
				error={data.error}
				onRetry={() => window.location.reload()}
				fallbackTitle="Unable to Load Current Conditions"
				fallbackMessage="Unable to retrieve current conditions for this location"
			/>
		{:else}
			<ErrorState
				error={null}
				fallbackTitle="No Weather Data Available"
				fallbackMessage="Unable to retrieve current conditions for this location"
				showRetry={false}
			/>
		{/if}
	</ClickableWeatherCard>
</div>
