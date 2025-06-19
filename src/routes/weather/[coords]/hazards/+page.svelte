<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { transformHazardDetails } from '$lib/services/weatherTransforms';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	let { data }: PageProps = $props();

	// Transform hazard data using service
	const details = transformHazardDetails(data.hazards?.description);
	const hasValidHazards = data.hasHazards && data.hazards;

	let scrollContainer;
	let textContent;
	let delay = 3000;
	let speed = 1;

	onMount(() => {
		if (!scrollContainer || !textContent || !hasValidHazards) return;

		const containerHeight = scrollContainer.clientHeight;
		const contentHeight = textContent.scrollHeight;

		if (contentHeight <= containerHeight) {
			// No need to scroll if content fits
			return;
		}

		let scrollTop = 0;

		setTimeout(() => {
			function scrollStep() {
				if (scrollTop + containerHeight >= contentHeight) {
					return; // Stop when the last line is fully visible
				}

				scrollTop += speed;
				scrollContainer.scrollTop = scrollTop;
				requestAnimationFrame(scrollStep);
			}

			requestAnimationFrame(scrollStep);
		}, delay);
	});
</script>

<main
	bind:this={scrollContainer}
	class="bg-advisory-red text-shadow scroll-container relative container mx-auto h-[100%] overflow-hidden p-12 font-[Star4000] text-6xl leading-tight text-white uppercase"
>
	{#if hasValidHazards}
		<div class="absolute whitespace-pre-wrap" bind:this={textContent}>
			<h2 class="mb-12">{data.hazards.headline}</h2>

			{#each details as detail}
				<p class="my-8">{detail}</p>
			{/each}
		</div>
	{:else if data.error}
		<ErrorDisplay 
			title="Unable to Load Weather Hazards" 
			message={data.error} 
		/>
	{:else}
		<ErrorDisplay 
			title="No Active Weather Hazards" 
			message="Your area is currently clear of weather alerts" 
		/>
	{/if}
</main>
