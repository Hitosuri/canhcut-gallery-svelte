<script lang="ts">
	import Header from '$lib/components/layout/header/Header.svelte';
	import '../app.css';
</script>
<svelte:head>
	<meta name="robots" content="noindex" />
	<meta name="googlebot" content="noindex" />
</svelte:head>

<div class="fixed inset-x-0 top-0 z-10 border-b border-black/5 dark:border-white/10">
	<Header />
</div>
<div class="relative z-0 px-4 pt-24 sm:px-24">
	<slot />
</div>
