<script lang="ts">
	import { api } from '$lib/index';
	let coords: { lat?: number; lon?: number } = $state({ lat: undefined, lon: undefined });

	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				console.log(position.coords.latitude, position.coords.longitude);
				coords.lat = position.coords.latitude;
				coords.lon = position.coords.longitude;
			});
		} else {
			alert('Geolocation is not supported by this browser.');
		}
	};
</script>

<main class="h-screen bg-[var(--color-ticker-blue)] font-[Star4000] text-white">
	<div class="container mx-auto p-12">
		<h1 class="text-shadow text-center text-5xl">Welcome to RetroWeather!</h1>
		<p class="mt-12">Let us use your geolocation to get started</p>
		<button class="btn btn-primary" onclick={() => getLocation()}>Use Geolocation</button>
		{#if coords.lat && coords.lon}
			<p>Latitude: {coords.lat}</p>
			<p>Longitude: {coords.lon}</p>
			<a href="/weather/{coords.lat},{coords.lon}" class="btn btn-primary">Proceed</a>
		{/if}
	</div>
</main>
