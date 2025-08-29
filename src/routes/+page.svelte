<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ImageConverter from '$lib/components/ImageConverter.svelte';
	import BannerAd from '$lib/components/BannerAd.svelte';
	import FeaturesSection from '$lib/sections/FeaturesSection.svelte';
	import HowItWorksSection from '$lib/sections/HowItWorksSection.svelte';
	import FormatComparisonSection from '$lib/sections/FormatComparisonSection.svelte';
	import CommonUseCasesSection from '$lib/sections/CommonUseCasesSection.svelte';
	import OptimizationTipsSection from '$lib/sections/OptimizationTipsSection.svelte';
	import FAQSection from '$lib/sections/FAQSection.svelte';

	// Initialize Google AdSense ads
	if (typeof window !== 'undefined') {
		setTimeout(() => {
			try {
				interface WindowWithAdsByGoogle extends Window {
					adsbygoogle: unknown[];
				}

				const windowWithAds = window as unknown as WindowWithAdsByGoogle;
				(windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || []).push({});
				(windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || []).push({});
			} catch (e) {
				console.error('AdSense error:', e);
			}
		}, 1000);
	}
</script>

<svelte:head>
	<title>Free Image Converter - Convert Between PNG, JPG, WebP & More</title>
	<meta
		name="description"
		content="Convert images between formats instantly. Support for PNG, JPG, JPEG, WebP, GIF, SVG, and more. Fast, free, secure browser-based image format converter."
	/>
	<meta
		name="keywords"
		content="image converter, png to jpg, jpg to png, webp converter, image format, free converter, online converter"
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="container mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
		<Header />
		<BannerAd adSlot="1234567890" />
		<ImageConverter />
		<FeaturesSection />
		<HowItWorksSection />
		<FormatComparisonSection />
		<CommonUseCasesSection />
		<OptimizationTipsSection />
		<FAQSection />
		<BannerAd adSlot="0987654321" />
		<Footer />
	</div>
</div>
