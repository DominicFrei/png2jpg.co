import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.test.ts',
				test: {
					name: 'browser',
					environment: 'browser',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }],
						headless: true
					},
					include: ['tests/unit/**/*.browser.{test,spec}.{js,ts}'],
					setupFiles: ['./vitest-setup-client.ts'],
					// Prevent SSR evaluation issues
					pool: 'browser',
					poolOptions: {
						browser: {
							isolate: false
						}
					} as Record<string, unknown>
				}
			},
			{
				extends: './vite.config.test.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
					exclude: ['tests/unit/**/*.browser.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
