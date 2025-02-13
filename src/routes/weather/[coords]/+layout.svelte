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

<main class="flex h-screen flex-col">
	<div class="bg-gradient-to-b from-[#291052] to-[#c15d02]">
		{@render children()}
	</div>
	<footer
		class="bg-ticker-blue text-shadow flex h-full px-20 py-4 font-[Star4000] text-5xl text-white"
	>
		<div class="container">Placeholder</div>
	</footer>
</main>
