<script lang="ts">
	import WeatherDisplay from '$lib/components/WeatherDisplay.svelte';
	import type { PageProps } from './$types';

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
</script>

<main class="h-1/2">
	<WeatherDisplay title="Local Forecast">
		{currentForecast}
	</WeatherDisplay>
	<!-- <iframe
		style="border-radius:12px"
		src="https://open.spotify.com/embed/playlist/4fy63sCR8lNnqj0U23yOjN?utm_source=generator"
		width="100%"
		height="152"
		frameBorder="0"
		title="Spotify Playlist"
		allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
		loading="lazy"
	></iframe> -->
</main>
