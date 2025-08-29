<script lang="ts">
	import '../app.css';
	import favicon from '../lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Hotjar Tracking Code for https://photoboost.app/ -->
	<script>
		(function (h, o, t, j, a, r) {
			h.hj =
				h.hj ||
				function () {
					(h.hj.q = h.hj.q || []).push(arguments);
				};
			h._hjSettings = { hjid: 6377915, hjsv: 6 };
			a = o.getElementsByTagName('head')[0];
			r = o.createElement('script');
			// noinspection JSValidateTypes
			r.async = 1;
			r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
			a.appendChild(r);
		})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
	</script>

	<!-- Google AdSense -->
	<script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6981538819685467"
		crossorigin="anonymous"
	></script>
</svelte:head>

{@render children?.()}
