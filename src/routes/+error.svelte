<script lang="ts">
	import { page } from '$app/stores';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	
	let error = $derived($page.error);
	let status = $derived($page.status);
	
	let errorTitle = $derived(getErrorTitle(status));
	let errorMessage = $derived(getErrorMessage(error, status));
	let canRetry = $derived(getCanRetry(status));
	
	function getErrorTitle(status: number): string {
		switch (status) {
			case 404:
				return 'Page Not Found';
			case 500:
				return 'Weather Service Unavailable';
			default:
				return 'Something Went Wrong';
		}
	}
	
	function getErrorMessage(error: any, status: number): string {
		if (error?.message) {
			return error.message;
		}
		
		switch (status) {
			case 404:
				return 'The weather page you\'re looking for doesn\'t exist.';
			case 500:
				return 'We\'re experiencing technical difficulties with our weather services. Please try again in a few moments.';
			default:
				return 'An unexpected error occurred while loading the weather data.';
		}
	}
	
	function getCanRetry(status: number): boolean {
		return status >= 500 || status === 0;
	}
	
	function handleRetry() {
		window.location.reload();
	}
	
	function goHome() {
		window.location.href = '/';
	}
</script>

<main class="h-screen bg-[var(--color-ticker-blue)] font-[Star4000] text-white">
	<div class="container mx-auto flex h-full flex-col items-center justify-center p-12">
		<div class="mb-8">
			<img src="/images/Logo3.png" alt="Weatherstar" class="mx-auto h-16" />
		</div>
		
		<div class="max-w-2xl text-center">
			<ErrorDisplay 
				title={errorTitle}
				message={errorMessage}
			/>
			
			<div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
				{#if canRetry}
					<button 
						class="btn btn-primary" 
						onclick={handleRetry}
					>
						Try Again
					</button>
				{/if}
				
				<button 
					class="btn btn-secondary" 
					onclick={goHome}
				>
					Go Home
				</button>
			</div>
			
			{#if status}
				<p class="mt-4 text-sm opacity-70">Error Code: {status}</p>
			{/if}
		</div>
	</div>
</main>