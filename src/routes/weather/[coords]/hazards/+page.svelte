<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount, onDestroy } from 'svelte';
	import { transformHazardDetails } from '$lib/services/weatherTransforms';
	import ErrorState from '$lib/components/ErrorState.svelte';

	let { data }: PageProps = $props();

	// Get all hazards from the data
	const allHazards = data.data?.hazards || [];
	const hasValidHazards = data.data?.hasHazards && allHazards.length > 0;

	let scrollContainer: HTMLElement;
	let textContent: HTMLDivElement;
	let currentHazardIndex = $state(0);
	let scrollPosition = $state(0);
	let isScrolling = $state(false);

	// Scrolling configuration
	const INITIAL_DELAY = 5000; // 5 seconds before starting scroll
	const SCROLL_SPEED = 1; // pixels per frame
	const PAUSE_BETWEEN_HAZARDS = 3000; // 3 seconds pause between hazards
	const PAUSE_AT_END = 2000; // 2 seconds pause at end before cycling

	let animationId: number;
	let timeoutId: number;

	// Get current hazard data using deriveds
	const currentHazard = $derived(allHazards[currentHazardIndex]);
	const currentDetails = $derived(transformHazardDetails(currentHazard?.description));

	function startScrolling() {
		if (!scrollContainer || !textContent || !hasValidHazards) return;

		const containerHeight = scrollContainer.clientHeight;
		const contentHeight = textContent.scrollHeight;

		// If content fits in container, just show it without scrolling
		if (contentHeight <= containerHeight) {
			timeoutId = setTimeout(() => {
				nextHazard();
			}, INITIAL_DELAY + PAUSE_AT_END);
			return;
		}

		isScrolling = true;
		scrollPosition = 0;
		scrollContainer.scrollTop = 0;

		// Start scrolling after initial delay
		timeoutId = setTimeout(() => {
			function scrollStep() {
				if (scrollPosition + containerHeight >= contentHeight) {
					// Reached the end, pause then move to next hazard
					isScrolling = false;
					timeoutId = setTimeout(() => {
						nextHazard();
					}, PAUSE_AT_END);
					return;
				}

				scrollPosition += SCROLL_SPEED;
				scrollContainer.scrollTop = scrollPosition;
				animationId = requestAnimationFrame(scrollStep);
			}

			scrollStep();
		}, INITIAL_DELAY);
	}

	function nextHazard() {
		if (allHazards.length <= 1) {
			// Only one hazard, restart scrolling
			setTimeout(() => {
				startScrolling();
			}, PAUSE_BETWEEN_HAZARDS);
			return;
		}

		// Move to next hazard
		currentHazardIndex = (currentHazardIndex + 1) % allHazards.length;

		// Start scrolling the new hazard after a brief pause
		setTimeout(() => {
			startScrolling();
		}, PAUSE_BETWEEN_HAZARDS);
	}

	function stopScrolling() {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		isScrolling = false;
	}

	onMount(() => {
		if (hasValidHazards) {
			startScrolling();
		}
	});

	onDestroy(() => {
		stopScrolling();
	});

	// Restart scrolling when hazard changes using $effect
	$effect(() => {
		if (currentHazard) {
			stopScrolling();
			// Small delay to ensure DOM updates
			setTimeout(() => {
				startScrolling();
			}, 100);
		}
	});
</script>

<main
	bind:this={scrollContainer}
	class="bg-advisory-red hazard-text-shadow scroll-container relative container mx-auto h-full overflow-hidden p-8 font-[Star4000] text-4xl leading-tight text-white uppercase"
>
	{#if hasValidHazards}
		<!-- Hazard indicator -->
		{#if allHazards.length > 1}
			<div class="absolute top-4 right-4 z-10 text-2xl">
				{currentHazardIndex + 1} of {allHazards.length}
			</div>
		{/if}

		<!-- Scrolling content -->
		<div class="absolute top-0 right-0 left-0 p-8 whitespace-pre-wrap" bind:this={textContent}>
			{#if currentHazard}
				<!-- Event type with severity styling -->
				<div class="mb-8 text-center">
					<div
						class="text-title-yellow mb-4 text-6xl font-bold {currentHazard.severity === 'Extreme'
							? 'hazard-urgent'
							: ''}"
					>
						⚠️ {currentHazard.event} ⚠️
					</div>
					{#if currentHazard.severity}
						<div class="text-orange-redux mb-4 text-3xl">
							Severity: {currentHazard.severity}
						</div>
					{/if}
					{#if currentHazard.certainty}
						<div class="mb-4 text-3xl">
							Certainty: {currentHazard.certainty}
						</div>
					{/if}
				</div>

				<!-- Headline -->
				{#if currentHazard.headline}
					<div class="mb-8 border-b-4 border-white pb-4 text-center text-5xl font-bold">
						{currentHazard.headline}
					</div>
				{/if}

				<!-- Areas affected -->
				{#if currentHazard.areaDesc}
					<div class="mb-8">
						<div class="text-title-yellow mb-4 text-3xl">AREAS AFFECTED:</div>
						<div class="text-4xl">{currentHazard.areaDesc}</div>
					</div>
				{/if}

				<!-- Effective dates -->
				{#if currentHazard.effective || currentHazard.expires}
					<div class="mb-8">
						{#if currentHazard.effective}
							<div class="mb-4">
								<span class="text-title-yellow">EFFECTIVE:</span>
								{new Date(currentHazard.effective).toLocaleString()}
							</div>
						{/if}
						{#if currentHazard.expires}
							<div class="mb-4">
								<span class="text-title-yellow">EXPIRES:</span>
								{new Date(currentHazard.expires).toLocaleString()}
							</div>
						{/if}
					</div>
				{/if}

				<!-- Description -->
				{#if currentDetails.length > 0}
					<div class="mb-8">
						<div class="text-title-yellow mb-4 text-3xl">DETAILS:</div>
						{#each currentDetails as detail}
							<p class="my-6 text-4xl leading-relaxed">{detail}</p>
						{/each}
					</div>
				{/if}

				<!-- Instructions -->
				{#if currentHazard.instruction}
					<div class="mb-8">
						<div class="text-title-yellow mb-4 text-3xl">INSTRUCTIONS:</div>
						<div class="text-4xl leading-relaxed">{currentHazard.instruction}</div>
					</div>
				{/if}

				<!-- Contact info -->
				<div class="mt-12 text-center text-2xl opacity-75">Issued by: National Weather Service</div>
			{/if}
		</div>

		<!-- Scrolling indicator -->
		{#if isScrolling}
			<div class="absolute right-4 bottom-4 animate-pulse text-xl opacity-75">Scrolling...</div>
		{/if}
	{:else if data.error}
		<ErrorState
			error={data.error}
			onRetry={() => window.location.reload()}
			fallbackTitle="Unable to Load Weather Hazards"
			fallbackMessage="Unable to retrieve weather hazards for this location"
		/>
	{:else}
		<div class="flex h-full items-center justify-center">
			<div class="text-center">
				<div class="text-title-yellow mb-8 text-6xl">✓</div>
				<div class="mb-4 text-4xl">No Active Weather Hazards</div>
				<div class="text-2xl opacity-75">Your area is currently clear of weather alerts</div>
			</div>
		</div>
	{/if}
</main>
