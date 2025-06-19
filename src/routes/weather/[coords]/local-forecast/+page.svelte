<script lang="ts">
	import WeatherDisplay from '$lib/components/WeatherDisplay.svelte';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

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

	onMount(() => {
		const interval = setInterval(() => {
			currentForecast = forecasts[index];
			if (index < forecasts.length) {
				index++;
			} else {
				index = 0;
			}
		}, 5000);

		return () => clearInterval(interval);
	});

	const goToCurrentConditions = () => {
		console.log('Going to local forecast');
		goto(`/weather/${data.coords}/current-conditions`);
	};
</script>

<main class="h-1/2" onclick={goToCurrentConditions}>
	<WeatherDisplay title="Local Forecast">
		<p class="font-[Star4000] text-5xl uppercase">{currentForecast}</p>
	</WeatherDisplay>
</main>
