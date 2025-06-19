<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	import ClickableWeatherCard from '$lib/components/ClickableWeatherCard.svelte';
	import WeatherDataGrid from '$lib/components/WeatherDataGrid.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import { celsiusToFahrenheit, metersToMiles, getWeatherImage } from '$lib';
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
		WeatherNavigation.goToLocalForecast(data.coords);
	};

	// Transform weather data using service
	const observation = data.latestObservations;
	const station = data.station;
	
	const temperature = getSafeTemperature(observation, celsiusToFahrenheit);
	const textDescription = getSafeTextDescription(observation);
	const humidity = getSafeHumidity(observation);
	const dewpoint = getSafeTemperature({ temperature: observation?.dewpoint }, celsiusToFahrenheit);
	const visibility = getSafeVisibility(observation, metersToMiles);
	const windChill = getSafeTemperature({ temperature: observation?.windChill }, celsiusToFahrenheit);
	const stationName = getSafeStationName(station);
	
	const hasValidData = data.hasData && 
		isValidWeatherObservation(observation) && 
		isValidWeatherStation(station);

	const weatherImage = getWeatherImage(
		observation?.presentWeather,
		observation?.textDescription
	);

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
					<!-- <div class="justify-items-center">
						{#if weatherImage}
							<img src={weatherImage} alt="Current weather condition Image" class="weather-icon" />
						{/if}
					</div> -->
				</div>
				<div>
					<h2 class="text-title-yellow up mb-2 text-2xl normal-case">
						{stationName}
					</h2>
					<WeatherDataGrid items={weatherDataItems} />
				</div>
			</div>
		{:else if data.error}
			<ErrorDisplay 
				title="Unable to Load Current Conditions" 
				message={data.error} 
			/>
		{:else}
			<ErrorDisplay 
				title="No Weather Data Available" 
				message="Unable to retrieve current conditions for this location" 
			/>
		{/if}
	</ClickableWeatherCard>
</div>
