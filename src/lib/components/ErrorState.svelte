<script lang="ts">
	import type { AppError } from '$lib/types/errors';
	import ErrorDisplay from './ErrorDisplay.svelte';
	
	let { 
		error,
		onRetry,
		showRetry = true,
		retryText = 'Try Again',
		fallbackTitle = 'Something Went Wrong',
		fallbackMessage = 'An unexpected error occurred'
	}: {
		error: AppError | string | null;
		onRetry?: () => void;
		showRetry?: boolean;
		retryText?: string;
		fallbackTitle?: string;
		fallbackMessage?: string;
	} = $props();
	
	let title = $derived(getErrorTitle(error));
	let message = $derived(getErrorMessage(error));
	let canRetry = $derived(getCanRetry(error));
	let isRetrying = $state(false);
	
	function getErrorTitle(error: AppError | string | null): string {
		if (!error) return fallbackTitle;
		
		if (typeof error === 'string') return fallbackTitle;
		
		switch (error.type) {
			case 'NETWORK':
				return 'Network Error';
			case 'API_ERROR':
				return 'Service Unavailable';
			case 'VALIDATION':
				return 'Invalid Data';
			case 'NOT_FOUND':
				return 'Not Found';
			case 'GEOLOCATION':
				return 'Location Error';
			case 'TIMEOUT':
				return 'Request Timeout';
			default:
				return fallbackTitle;
		}
	}
	
	function getErrorMessage(error: AppError | string | null): string {
		if (!error) return fallbackMessage;
		
		if (typeof error === 'string') return error;
		
		return error.message || fallbackMessage;
	}
	
	function getCanRetry(error: AppError | string | null): boolean {
		if (!error || typeof error === 'string') return false;
		return error.retryable && showRetry && !!onRetry;
	}
	
	async function handleRetry() {
		if (!onRetry || isRetrying) return;
		
		isRetrying = true;
		try {
			await onRetry();
		} finally {
			isRetrying = false;
		}
	}
</script>

<div class="error-state">
	<ErrorDisplay {title} {message} />
	
	{#if canRetry}
		<div class="mt-6 text-center">
			<button 
				class="btn btn-primary"
				onclick={handleRetry}
				disabled={isRetrying}
			>
				{#if isRetrying}
					<span class="loading loading-spinner loading-sm"></span>
					Retrying...
				{:else}
					{retryText}
				{/if}
			</button>
		</div>
	{/if}
</div>