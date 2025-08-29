<script lang="ts">
	import type { Component } from 'svelte';

	export let title: string;
	export let description: string;
	export let icon: Component;
</script>

<div class="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
	<div class="mb-3 flex justify-center text-blue-600 sm:mb-4">
		<svelte:component this={icon} />
	</div>
	<h3 class="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">{title}</h3>
	<p class="text-sm text-gray-600 sm:text-base">{description}</p>
</div>
