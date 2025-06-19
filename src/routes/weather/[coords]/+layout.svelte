<script lang="ts">
	import { onNavigate } from '$app/navigation';
	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="flex h-screen flex-col" id="weatherLayout">
	<!-- Roughly the top 6.25 percent of the screen-->
	<div class="bg-top-purple h-[6.25%]">
		<!-- <nav class="text-center text-white">Nav area</nav> -->
	</div>
	<!-- Main Content Area-->
	<div class="flex-1 bg-gradient-to-b from-[#291052] to-[#c15d02]">
		{@render children()}
	</div>
	<!-- Roughly the bottom 16.6 percent of the screen-->
	<div class="bg-bottom-purple bg-ticker-blue min-h-[16.6%] border-t-2 border-t-gray-300">
		<div
			class="container mx-auto flex h-full max-w-[1000px] flex-col items-end justify-end align-bottom"
		>
			<audio src="/audio/champagne.mp3" autoplay style="width:100%; max-width:400px;"></audio>
			<!-- <iframe
				style="border-radius:12px"
				src="https://open.spotify.com/embed/playlist/4fy63sCR8lNnqj0U23yOjN?utm_source=generator"
				width="100%"
				height="100"
				frameBorder="0"
				title="Spotify Playlist"
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				loading="lazy"
			></iframe> -->
		</div>
	</div>
</div>
