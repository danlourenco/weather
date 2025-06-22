export enum ErrorType {
	NETWORK = 'NETWORK',
	API_ERROR = 'API_ERROR',
	VALIDATION = 'VALIDATION',
	NOT_FOUND = 'NOT_FOUND',
	GEOLOCATION = 'GEOLOCATION',
	TIMEOUT = 'TIMEOUT'
}

export interface AppError {
	type: ErrorType;
	message: string;
	details?: unknown;
	retryable: boolean;
	statusCode?: number;
}

export interface LoaderResult<T> {
	data: T | null;
	error: AppError | null;
	loading?: boolean;
}

export class WeatherError extends Error {
	public readonly type: ErrorType;
	public readonly retryable: boolean;
	public readonly statusCode?: number;
	public readonly details?: unknown;

	constructor(type: ErrorType, message: string, options?: {
		retryable?: boolean;
		statusCode?: number;
		details?: unknown;
		cause?: Error;
	}) {
		super(message, { cause: options?.cause });
		this.name = 'WeatherError';
		this.type = type;
		this.retryable = options?.retryable ?? false;
		this.statusCode = options?.statusCode;
		this.details = options?.details;
	}

	toAppError(): AppError {
		return {
			type: this.type,
			message: this.message,
			details: this.details,
			retryable: this.retryable,
			statusCode: this.statusCode
		};
	}
}

export function createNetworkError(message: string, statusCode?: number): WeatherError {
	return new WeatherError(ErrorType.NETWORK, message, {
		retryable: true,
		statusCode
	});
}

export function createApiError(message: string, statusCode?: number, details?: unknown): WeatherError {
	return new WeatherError(ErrorType.API_ERROR, message, {
		retryable: statusCode ? statusCode >= 500 : false,
		statusCode,
		details
	});
}

export function createValidationError(message: string, details?: unknown): WeatherError {
	return new WeatherError(ErrorType.VALIDATION, message, {
		retryable: false,
		details
	});
}

export function createNotFoundError(message: string): WeatherError {
	return new WeatherError(ErrorType.NOT_FOUND, message, {
		retryable: false,
		statusCode: 404
	});
}

export function createGeolocationError(message: string, details?: unknown): WeatherError {
	return new WeatherError(ErrorType.GEOLOCATION, message, {
		retryable: true,
		details
	});
}

export function createTimeoutError(message: string): WeatherError {
	return new WeatherError(ErrorType.TIMEOUT, message, {
		retryable: true
	});
}