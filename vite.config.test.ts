import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// Minimal config for tests - includes SvelteKit for .svelte imports
	// but without other plugins to minimize override warnings
	plugins: [sveltekit()],
	assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg', '**/*.gif', '**/*.webp']
});
