<script>
	/**
	 * Global Error Page
	 *
	 * This component handles all errors that occur in the application.
	 * It displays the error status code, message, and provides a way to navigate back to the home page.
	 *
	 * SvelteKit automatically renders this page when an error occurs during:
	 * - Server-side rendering
	 * - Loading data
	 * - Client-side navigation
	 */
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
</script>

<svelte:head>
	<title>Lỗi {$page.status} | Canhcut.moe</title>
	<meta name="description" content="Đã xảy ra lỗi khi tải trang" />
</svelte:head>

<div class="flex min-h-[70vh] flex-col items-center justify-center p-4">
	<div class="max-w-md text-center">
		<!-- Error status code -->
		<h1 class="mb-4 text-6xl font-bold text-primary">{$page.status}</h1>

		<!-- Error message -->
		<p class="mb-8 text-xl font-medium text-base-content/70">
			{$page.error?.message || 'Đã xảy ra lỗi khi tải trang'}
		</p>

		<!-- Stack trace in development mode (optional) -->
		{#if dev && $page.error && 'stack' in $page.error}
			<div class="mb-8 rounded-lg bg-base-200 p-4 text-left">
				<pre class="whitespace-pre-wrap text-sm text-base-content/70">{$page.error.stack}</pre>
			</div>
		{/if}

		<!-- Return to home button -->
		<a href="/" class="btn btn-primary">Quay về trang chủ</a>
	</div>
</div>
