<script>
	/**
	 * Album ID-specific Error Page
	 *
	 * This component handles errors that occur when trying to view a specific album by ID.
	 * It provides a targeted error message for when an album cannot be found or accessed.
	 */
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
</script>

<svelte:head>
	<title>Album không tìm thấy | Cảnh Cút Moe</title>
	<meta name="description" content="Album không tồn tại hoặc đã bị xóa" />
</svelte:head>

<div class="flex min-h-[70vh] flex-col items-center justify-center p-4">
	<div class="max-w-md text-center">
		<!-- Album not found icon -->
		<div class="mb-4 flex justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" class="size-24 text-primary" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm0-2h16V6H4v12Zm8-1l4-4l-1.4-1.4l-1.6 1.6V9h-2v4.2l-1.6-1.6L8 13l4 4Zm-8 1V6v12Z"
				/>
			</svg>
		</div>

		<!-- Error status code -->
		<h1 class="mb-2 text-4xl font-bold text-primary">{$page.status}</h1>

		<!-- Error title -->
		<h2 class="mb-4 text-2xl font-semibold">Album không tìm thấy</h2>

		<!-- Error message -->
		<p class="mb-8 text-lg font-medium text-base-content/70">
			{$page.error?.message || 'Album bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'}
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
