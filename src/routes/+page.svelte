<script lang="ts">
	import { goto } from '$app/navigation';

	let coords: { lat?: number; lon?: number } = $state({ lat: undefined, lon: undefined });
	let isFetchingLocation = $state(false);
	let didClickGetLocation = $state(false);

	function getPosition(options?: PositionOptions): Promise<GeolocationPosition> {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
	}

	async function getLocation() {
		try {
			isFetchingLocation = true;
			didClickGetLocation = true;
			const position = await getPosition();
			coords.lat = position.coords.latitude;
			coords.lon = position.coords.longitude;
		} catch (error) {
			console.error(error);
		} finally {
			isFetchingLocation = false;
		}
	}

	function navigateToPage() {
		// navigate to the weather page
		setTimeout(() => {
			goto(`/weather/${coords.lat},${coords.lon}`);
		}, 3000);
	}

	$effect(() => {
		if (coords.lat && coords.lon && didClickGetLocation) {
			navigateToPage();
		}
	});
</script>

<main class="h-screen bg-[var(--color-ticker-blue)] font-[Star4000] text-white">
	<div class="container mx-auto p-12">
		<h1 class="text-shadow text-center text-5xl">Welcome to RetroWeather!</h1>
		<p class="mt-12">Let us use your geolocation to get started</p>
		<button class="btn btn-primary" disabled={didClickGetLocation} onclick={() => getLocation()}
			>Use Geolocation</button
		>
		{#if isFetchingLocation}
			<p class="mt-4">Fetching location...</p>
		{/if}
		{#if coords.lat && coords.lon}
			<p>Latitude: {coords.lat}</p>
			<p>Longitude: {coords.lon}</p>
			<p>Redirecting to weather page, hang tight...</p>
		{/if}
	</div>
</main>
