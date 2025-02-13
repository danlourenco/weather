<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	import WeatherDisplay from '$lib/components/WeatherDisplay.svelte';
	import { celsiusToFahrenheit } from '$lib';

	const { temperature, dewpoint, windChill } = data.latestObservations;
</script>

<div>
	<WeatherDisplay title="Current Conditions">
		<h2 class="text-title-yellow">{data.station.name.split(', ')[1]}</h2>
		<dl class="grid grid-cols-2 gap-x-2 gap-y-2">
			<dt class="after:content-[':']">Temperature</dt>
			<dd>{Math.round(celsiusToFahrenheit(data.latestObservations.temperature.value))}°F</dd>

			<dt class="after:content-[':']">Dewpoint</dt>
			<dd>{Math.round(celsiusToFahrenheit(data.latestObservations.dewpoint.value))}°</dd>

			<dt class="after:content-[':']">Wind Chill</dt>
			<dd>{Math.round(celsiusToFahrenheit(data.latestObservations.windChill.value))}°</dd>
		</dl>
	</WeatherDisplay>
	<pre class="">
		{JSON.stringify(data, null, 2)}
	</pre>
</div>
