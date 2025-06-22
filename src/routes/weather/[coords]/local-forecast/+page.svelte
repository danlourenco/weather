<script lang="ts">
	import ClickableWeatherCard from '$lib/components/ClickableWeatherCard.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { WeatherNavigation } from '$lib/services/navigation';
	import { transformForecastPeriods } from '$lib/services/weatherTransforms';

	let { data }: PageProps = $props();

	// Transform forecast data using service
	const forecasts = transformForecastPeriods(data.data?.forecast || []);

	let index = $state(0);
	let currentForecast = $state(forecasts[0] || '');

	onMount(() => {
		// Only start rotation if we have forecast data
		if (!data.data?.hasForecast || forecasts.length === 0) return;
		
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
		WeatherNavigation.goToCurrentConditions(data.data?.coords || '');
	};
</script>

<main class="h-1/2">
	<ClickableWeatherCard title="Local Forecast" onclick={goToCurrentConditions}>
		{#if data.data?.hasForecast && forecasts.length > 0}
			<p class="font-[Star4000] text-5xl uppercase">{currentForecast}</p>
		{:else if data.error}
			<ErrorState 
				error={data.error}
				onRetry={() => window.location.reload()}
				fallbackTitle="Unable to Load Forecast"
				fallbackMessage="Unable to retrieve weather forecast for this location"
			/>
		{:else}
			<ErrorState 
				error={null}
				fallbackTitle="No Forecast Available"
				fallbackMessage="Unable to retrieve weather forecast for this location"
				showRetry={false}
			/>
		{/if}
	</ClickableWeatherCard>
</main>
