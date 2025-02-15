<script lang="ts">
	let { children, title = 'Title' } = $props();

	let currentTime = $state(
		new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})
	);

	let currentDate = $state(
		new Date().toLocaleDateString([], {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		})
	);

	setInterval(() => {
		currentTime = new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
		currentDate = new Date().toLocaleDateString([], {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}, 1000);
</script>

<div class="text-shadow flex w-full flex-col font-[Star4000Large]">
	<heading
		class="relative z-10 flex flex-row bg-gradient-to-b from-[#be5c01] to-[#291052] text-white"
	>
		<div class="container mx-auto flex max-w-[1000px] flex-row items-center justify-start gap-x-12">
			<div class="logo w-fit">
				<img src="/images/Logo3.png" class="logo-img" alt="Weatherstar" />
			</div>
			<div class="title text-title-yellow text-shadow-lg z-2 text-4xl">
				{title}
			</div>

			<div
				class="date-time text-shadow-lg relative ml-auto flex w-fit flex-col items-end font-[Star4000Small] text-3xl md:text-4xl"
			>
				<div class=" md:leading-[0.3]">{currentTime}</div>
				<div>{currentDate}</div>
			</div>
		</div></heading
	>
	<section class="flex-1">
		<div
			class="text-shadow-lg container mx-auto aspect-[1.7/1] max-w-[1000px] bg-[#21285a] p-8 text-4xl text-white shadow-[inset_0px_0px_5px_15px_rgba(38,81,177,1)]"
		>
			{@render children()}
		</div>
	</section>
</div>

<style>
	.text-shadow {
		text-shadow:
			3px 3px 0 #000,
			-1.5px -1.5px 0 #000,
			0 -1.5px 0 #000,
			1.5px -1.5px 0 #000,
			1.5px 0 0 #000,
			1.5px 1.5px 0 #000,
			0 1.5px 0 #000,
			-1.5px 1.5px 0 #000,
			-1.5px 0 0 #000;
	}
</style>
