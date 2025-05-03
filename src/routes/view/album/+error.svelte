<script>
	/**
	 * Album-specific Error Page
	 *
	 * This component handles errors that occur specifically in the album routes.
	 * It provides a more specific error message and UI for album-related errors.
	 */
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
</script>

<svelte:head>
	<title>Lỗi Album {$page.status} | Cảnh Cút Moe</title>
	<meta name="description" content="Đã xảy ra lỗi khi tải album" />
</svelte:head>

<div class="flex min-h-[70vh] flex-col items-center justify-center p-4">
	<div class="max-w-md text-center">
		<!-- Album icon -->
		<div class="mb-4 flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" class="size-24 text-primary" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm0-2h14V5H5v14Zm1-2h12l-3.75-5l-3 4L9 13l-3 4Zm-1 2V5v14Z"
				/>
			</svg>
		</div>

		<!-- Error status code -->
		<h1 class="mb-2 text-4xl font-bold text-primary">{$page.status}</h1>

		<!-- Error title -->
		<h2 class="mb-4 text-2xl font-semibold">Không thể tải album</h2>

		<!-- Error message -->
		<p class="mb-8 text-lg font-medium text-base-content/70">
			{$page.error?.message ||
				'Đã xảy ra lỗi khi tải album. Album có thể không tồn tại hoặc đã bị xóa.'}
		</p>

		<!-- Stack trace in development mode (optional) -->
		{#if dev && $page.error && 'stack' in $page.error}
			<div class="mb-8 rounded-lg bg-base-200 p-4 text-left">
				<pre class="whitespace-pre-wrap text-sm text-base-content/70">{$page.error.stack}</pre>
			</div>
		{/if}

		<!-- Action buttons -->
		<div class="flex flex-col gap-2 sm:flex-row sm:justify-center">
			<a href="/view/album/DSDB53TG" class="btn btn-outline">Xem album khác</a>
			<a href="/" class="btn btn-primary">Quay về trang chủ</a>
		</div>
	</div>
</div>
