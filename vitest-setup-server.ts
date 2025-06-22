import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { weatherApiHandlers } from './src/lib/services/__mocks__/handlers';

// Setup MSW server
export const server = setupServer(...weatherApiHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock timers for testing retry logic - set up fake timers per test instead of globally
