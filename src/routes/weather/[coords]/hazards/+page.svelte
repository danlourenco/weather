<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();

	const details = data.hazards.description.split('\n\n');

	let scrollContainer;
	let textContent;
	let delay = 3000;
	let speed = 1;

	onMount(() => {
		if (!scrollContainer || !textContent) return;

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
	class="bg-advisory-red text-shadow scroll-container relative h-[100%] overflow-hidden p-12 font-[Star4000] text-6xl leading-tight text-white uppercase"
>
	<div class=" absolute whitespace-pre-wrap" bind:this={textContent}>
		<h2 class="mb-12">{data.hazards.headline}</h2>

		{#each details as detail}
			<p class="my-8">{detail}</p>
		{/each}
	</div>
</main>
