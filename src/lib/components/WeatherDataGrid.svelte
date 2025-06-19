<script lang="ts">
	interface WeatherDataItem {
		label: string;
		value: string | number;
		unit?: string;
	}

	let { items }: { items: WeatherDataItem[] } = $props();
</script>

<dl class="grid grid-cols-2 gap-x-2 gap-y-3 text-2xl">
	{#each items as item}
		<dt class="after:content-[':']">{item.label}</dt>
		<dd class="text-right">
			{item.value}{item.unit || ''}
		</dd>
	{/each}
</dl>