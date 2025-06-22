<script lang="ts">
	import { page } from '$app/stores';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	
	let error = $derived($page.error);
	let status = $derived($page.status);
	
	let errorTitle = $derived(getErrorTitle(status));
	let errorMessage = $derived(getErrorMessage(error, status));
	
	function getErrorTitle(status: number): string {
		switch (status) {
			case 404:
				return 'Location Not Found';
			case 500:
				return 'Weather Service Error';
			default:
				return 'Weather Data Unavailable';
		}
	}
	
	function getErrorMessage(error: any, status: number): string {
		if (error?.message) {
			return error.message;
		}
		
		switch (status) {
			case 404:
				return 'We couldn\'t find weather data for this location. Please check your coordinates and try again.';
			case 500:
				return 'The National Weather Service is currently experiencing issues. Please try again later.';
			default:
				return 'Unable to load weather information. This may be due to invalid coordinates or service issues.';
		}
	}
	
	function handleRetry() {
		window.location.reload();
	}
	
	function goHome() {
		window.location.href = '/';
	}
</script>

<div class="flex h-screen flex-col" id="weatherLayout">
	<div class="bg-top-purple h-[6.25%]"></div>
	
	<div class="flex-1 bg-gradient-to-b from-[#291052] to-[#c15d02]">
		<div class="container mx-auto flex h-full max-w-[1000px] flex-col items-center justify-center p-8">
			<div class="mb-8">
				<img src="/images/Logo3.png" alt="Weatherstar" class="mx-auto h-16" />
			</div>
			
			<div class="max-w-2xl text-center text-white">
				<ErrorDisplay 
					title={errorTitle}
					message={errorMessage}
				/>
				
				<div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
					<button 
						class="btn btn-primary" 
						onclick={handleRetry}
					>
						Try Again
					</button>
					
					<button 
						class="btn btn-secondary" 
						onclick={goHome}
					>
						Find New Location
					</button>
				</div>
				
				{#if status}
					<p class="mt-4 text-sm opacity-70">Error Code: {status}</p>
				{/if}
			</div>
		</div>
	</div>
	
	<div class="bg-bottom-purple bg-ticker-blue min-h-[16.6%] border-t-2 border-t-gray-300"></div>
</div>