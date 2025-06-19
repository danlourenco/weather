<script lang="ts">
	let { title, message }: { title: string; message: string } = $props();
</script>

<div class="flex h-full items-center justify-center">
	<div class="text-center">
		<h2 class="mb-8 text-4xl">{title}</h2>
		<p class="text-2xl">{message}</p>
	</div>
</div>