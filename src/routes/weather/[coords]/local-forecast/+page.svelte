<script lang="ts">
	import WeatherDisplay from '$lib/components/WeatherDisplay.svelte';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';

	interface Period {
		name: string;
		detailedForecast: string;
	}

	let { data }: PageProps = $props();

	const forecasts = data?.forecast?.map(
		(period: Period) => `${period.name}...${period.detailedForecast}`
	);

	let index = $state(0);

	let currentForecast = $state(forecasts[0]);

	setInterval(() => {
		currentForecast = forecasts[index];
		if (index < forecasts.length) {
			index++;
		} else {
			index = 0;
		}
	}, 10000);

	const goToCurrentConditions = () => {
		console.log('Going to local forecast');
		goto('/weather/42.1181163,-71.3396184/current-conditions');
	};
</script>

<main class="h-1/2" onclick={goToCurrentConditions}>
	<WeatherDisplay title="Local Forecast">
		<p class="font-[Star4000] text-5xl uppercase">{currentForecast}</p>
	</WeatherDisplay>
</main>
