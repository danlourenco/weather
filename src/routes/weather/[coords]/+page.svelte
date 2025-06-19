<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	import { WeatherNavigation } from '$lib/services/navigation';

	const handleVideoEnded = () => {
		WeatherNavigation.goToLocalForecast(data.coords);
	};
</script>

<main>
	<video autoplay class="h-full w-full object-cover" onended={handleVideoEnded}>
		<source src="/videos/localforecast93.mp4" type="video/mp4" />
	</video>
</main>
