<script lang="ts">
	import FeatureCard from '$lib/FeatureCard.svelte';
	import ImageFormatIcon from '$lib/icons/ImageFormatIcon.svelte';
	import LockIcon from '$lib/icons/LockIcon.svelte';
	import LightningIcon from '$lib/icons/LightningIcon.svelte';
</script>

<section class="mt-12 sm:mt-16">
	<h2 class="mb-6 text-center text-2xl font-bold text-gray-900 sm:mb-8 sm:text-3xl">
		Why Choose Our Converter?
	</h2>
	<div class="grid gap-6 md:grid-cols-3 md:gap-8">
		<FeatureCard
			title="All Major Formats"
			description="Supports PNG, JPG, WebP, GIF, SVG, and more formats."
			icon={ImageFormatIcon}
		/>
		<FeatureCard
			title="100% Private"
			description="All conversions happen locally in your browser. No uploads."
			icon={LockIcon}
		/>
		<FeatureCard
			title="Lightning Fast"
			description="Convert multiple images instantly with batch processing."
			icon={LightningIcon}
		/>
	</div>
</section>
