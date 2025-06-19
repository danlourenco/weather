<script lang="ts">
	let { title, onclick, children }: { 
		title: string; 
		onclick: () => void;
		children: any;
	} = $props();
	
	import WeatherDisplay from './WeatherDisplay.svelte';
</script>

<div {onclick} class="cursor-pointer">
	<WeatherDisplay {title}>
		{@render children()}
	</WeatherDisplay>
</div>