<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	import { goto } from '$app/navigation';
	import WeatherDisplay from '$lib/components/WeatherDisplay.svelte';
	import { celsiusToFahrenheit, metersToMiles, getWeatherImage } from '$lib';

	const goToLocalForecast = () => {
		console.log('Going to local forecast');
		goto('/weather/42.1181163,-71.3396184/local-forecast');
	};

	const weatherImage = getWeatherImage(
		data.latestObservations.presentWeather,
		data.latestObservations.textDescription
	);

	console.log(data.latestObservations);
</script>

<div id="current-conditions" onclick={goToLocalForecast}>
	<WeatherDisplay title="Current Conditions">
		<div class="flex flex-row justify-between">
			<div class="flex w-1/2 flex-col text-center">
				<div>{Math.round(celsiusToFahrenheit(data.latestObservations.temperature.value))}°F</div>
				<div class="font-[Star4000Extended] text-4xl">
					{data.latestObservations.textDescription}
				</div>
				<!-- <div class="justify-items-center">
					{#if weatherImage}
						<img src={weatherImage} alt="Current weather condition Image" class="weather-icon" />
					{/if}
				</div> -->
			</div>
			<div>
				<h2 class="text-title-yellow up mb-2 text-2xl normal-case">
					{data.station.name.split(', ')[1]}
				</h2>
				<dl class="grid grid-cols-2 gap-x-2 gap-y-3 text-2xl">
					<dt class="after:content-[':']">Humidity</dt>
					<dd class="text-right">
						{Math.round(data.latestObservations.relativeHumidity.value)}%
					</dd>

					<dt class="after:content-[':']">Dewpoint</dt>
					<dd class="text-right">
						{Math.round(celsiusToFahrenheit(data.latestObservations.dewpoint.value))}°
					</dd>

					<dt class="after:content-[':']">Visibility</dt>
					<dd class="text-right">
						{metersToMiles(data.latestObservations.visibility.value)} mi.
					</dd>

					<dt class="after:content-[':']">Wind Chill</dt>
					<dd class="text-right">
						{Math.round(celsiusToFahrenheit(data.latestObservations.windChill.value))}°
					</dd>
				</dl>
			</div>
		</div>
	</WeatherDisplay>
	<pre class="hidden">
		{JSON.stringify(data, null, 2)}
	</pre>
</div>
