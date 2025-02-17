<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	import { goto } from '$app/navigation';

	const handleVideoEnded = () => {
		console.log({ data });

		goto(`/weather/${data.coords}/local-forecast`);
	};
</script>

<main>
	<video autoplay class="h-full w-full object-cover" onended={handleVideoEnded}>
		<source src="/videos/localforecast93.mp4" type="video/mp4" />
	</video>
</main>
