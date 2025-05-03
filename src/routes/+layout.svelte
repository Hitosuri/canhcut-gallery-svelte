<script lang="ts">
	import Header from '$lib/components/layout/header/Header.svelte';
	import '../app.css';
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
	<meta name="googlebot" content="noindex" />
</svelte:head>
<div class="fixed left-4 right-4 top-4 z-10 pr-scroll-bar sm:left-8 sm:right-8">
	<Header />
</div>
<div class="relative z-0 mt-24 px-4 sm:px-8">
	<slot />
</div>
