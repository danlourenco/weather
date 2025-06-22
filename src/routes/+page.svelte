<script lang="ts">
	import { goto } from '$app/navigation';
	import { createGeolocationError } from '$lib/types/errors';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import type { AppError } from '$lib/types/errors';

	let coords: { lat?: number; lon?: number } = $state({ lat: undefined, lon: undefined });
	let isFetchingLocation = $state(false);
	let didClickGetLocation = $state(false);
	let geolocationError = $state<AppError | null>(null);

	function getPosition(options?: PositionOptions): Promise<GeolocationPosition> {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
	}

	async function getLocation() {
		try {
			isFetchingLocation = true;
			didClickGetLocation = true;
			geolocationError = null;
			const position = await getPosition();
			coords.lat = position.coords.latitude;
			coords.lon = position.coords.longitude;
		} catch (error) {
			console.error(error);
			if (error instanceof GeolocationPositionError) {
				switch (error.code) {
					case error.PERMISSION_DENIED:
						geolocationError = createGeolocationError(
							'Location access denied. Please enable location permissions and try again.'
						).toAppError();
						break;
					case error.POSITION_UNAVAILABLE:
						geolocationError = createGeolocationError(
							'Location information unavailable. Please check your device settings.'
						).toAppError();
						break;
					case error.TIMEOUT:
						geolocationError = createGeolocationError(
							'Location request timed out. Please try again.'
						).toAppError();
						break;
					default:
						geolocationError = createGeolocationError(
							'Unable to get your location. Please try again.'
						).toAppError();
				}
			} else {
				geolocationError = createGeolocationError(
					'An unexpected error occurred while getting your location.'
				).toAppError();
			}
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
		{#if geolocationError}
			<div class="mt-8">
				<ErrorState 
					error={geolocationError}
					onRetry={() => {
						didClickGetLocation = false;
						getLocation();
					}}
					retryText="Try Again"
				/>
			</div>
		{:else if isFetchingLocation}
			<p class="mt-4">Fetching location...</p>
		{:else if coords.lat && coords.lon}
			<p>Latitude: {coords.lat}</p>
			<p>Longitude: {coords.lon}</p>
			<p>Redirecting to weather page, hang tight...</p>
		{/if}
	</div>
</main>
