<script lang="ts">
	import ClickableWeatherCard from '$lib/components/ClickableWeatherCard.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { WeatherNavigation } from '$lib/services/navigation';
	import { transformForecastPeriods } from '$lib/services/weatherTransforms';

	let { data }: PageProps = $props();

	// Transform forecast data using service
	const forecasts = transformForecastPeriods(data?.forecast || []);

	let index = $state(0);
	let currentForecast = $state(forecasts[0] || '');

	onMount(() => {
		// Only start rotation if we have forecast data
		if (!data.hasForecast || forecasts.length === 0) return;
		
		const interval = setInterval(() => {
			currentForecast = forecasts[index];
			if (index < forecasts.length - 1) {
				index++;
			} else {
				index = 0;
			}
		}, 5000);

		return () => clearInterval(interval);
	});

	const goToCurrentConditions = () => {
		WeatherNavigation.goToCurrentConditions(data.coords);
	};
</script>

<main class="h-1/2">
	<ClickableWeatherCard title="Local Forecast" onclick={goToCurrentConditions}>
		{#if data.hasForecast && forecasts.length > 0}
			<p class="font-[Star4000] text-5xl uppercase">{currentForecast}</p>
		{:else if data.error}
			<ErrorDisplay 
				title="Unable to Load Forecast" 
				message={data.error} 
			/>
		{:else}
			<ErrorDisplay 
				title="No Forecast Available" 
				message="Unable to retrieve weather forecast for this location" 
			/>
		{/if}
	</ClickableWeatherCard>
</main>
