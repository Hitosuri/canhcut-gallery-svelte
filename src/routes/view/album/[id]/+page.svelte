<script lang="ts">
	/**
	 * Album View Page Component
	 *
	 * This component displays a responsive photo gallery with the following features:
	 * - Responsive grid layout that adjusts based on screen size
	 * - PhotoSwipe lightbox for full-screen image viewing
	 * - Image selection functionality for batch operations
	 * - Mobile-friendly UI with adaptive controls
	 * - Thumbnail carousel in lightbox mode
	 */

	// Import PhotoSwipe for lightbox functionality
	import PhotoSwipeLightbox from 'photoswipe/lightbox';
	import 'photoswipe/style.css';
	import PhotoSwipe, { type DataSourceObject } from 'photoswipe';

	// Svelte imports
	import { onDestroy, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly, slide } from 'svelte/transition';
	import { browser } from '$app/environment';

	// Component imports
	import ResizeWatcher from '$lib/components/utilities/ResizeWatcher.svelte';
	import { lazyLoad } from '$lib/actions/lazy-load';

	// Carousel for thumbnails in lightbox
	import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';

	// Icon imports
	import Icon from '@iconify/svelte';
	import downloadIcon from '@iconify-icons/material-symbols/download-rounded';
	import zipIcon from '@iconify-icons/material-symbols/folder-zip-outline-rounded';
	import checkCircleIcon from '@iconify-icons/material-symbols/check-circle-rounded';
	import shareIcon from '@iconify-icons/material-symbols/ios-share-rounded';
	import menuIcon from '@iconify-icons/material-symbols/menu-rounded';
	import heartcheck from '@iconify-icons/material-symbols/heart-check';
	import kidstar from '@iconify-icons/material-symbols/kid-star';
	import cameraIcon from '@iconify-icons/material-symbols/photo-camera-rounded';
	import loadingIcon from '@iconify-icons/material-symbols/progress-activity';

	// Types
	import type { PageData } from './$types';

	// Page data containing the album images
	export let data: PageData;

	// SVG for the close button in the lightbox
	const closeBtnSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="pswp__icn" viewBox="0 0 24 24">
	<use class="pswp__icn-shadow"></use>
	<path d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z" />
</svg>`;

	// SVG path for the download button in the lightbox
	const downloadBtnSvgPath = `<path d="M12 15.575q-.2 0-.375-.062T11.3 15.3l-3.6-3.6q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L11 12.15V5q0-.425.288-.712T12 4t.713.288T13 5v7.15l1.875-1.875q.3-.3.713-.288t.712.313q.275.3.288.7t-.288.7l-3.6 3.6q-.15.15-.325.213t-.375.062M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20z" />`;

	// SVG for the previous/next arrow buttons in the lightbox
	const arrowPrevSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="pswp__icn" viewBox="0 0 24 24">
	<path d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12t.063-.375t.212-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z" />
</svg>`;

	// Component state variables
	let lightbox: PhotoSwipeLightbox; // PhotoSwipe lightbox instance
	let container: HTMLDivElement; // Container element for the image grid
	let emblaCarousel: EmblaCarouselType | undefined; // Embla carousel instance for thumbnails
	let isMobileSelectOptionOpen = false; // Whether the mobile selection options menu is open
	let eventSource: EventSource;

	$: [images, selectedIds] = [data.images, [] as number[]];

	// Initialize PhotoSwipe lightbox and thumbnail carousel when component mounts
	onMount(() => {
		// Create and configure the PhotoSwipe lightbox
		lightbox = new PhotoSwipeLightbox({
			gallery: container, // Container element for the gallery
			children: 'a', // Selector for clickable elements that open the lightbox
			pswpModule: PhotoSwipe, // PhotoSwipe core module
			wheelToZoom: true, // Enable mouse wheel zooming
			closeSVG: closeBtnSvg, // Custom close button SVG
			arrowPrevSVG: arrowPrevSvg, // Custom previous arrow SVG
			arrowNextSVG: arrowPrevSvg, // Custom next arrow SVG (reusing prev)
			padding: {
				// Padding around the image in the lightbox
				left: 16,
				top: 16,
				right: 16,
				bottom: 120 // Extra bottom padding for thumbnails
			},
			loop: false, // Don't loop back to the first image after the last
			preload: [0, 0], // Don't preload adjacent slides
			trapFocus: false, // Don't trap focus within the lightbox
			returnFocus: false // Don't return focus after closing
		});

		// Clean up the carousel when the lightbox is closed
		lightbox.on('closingAnimationEnd', () => {
			emblaCarousel?.destroy();
			emblaCarousel = undefined;
		});

		// Sync the carousel with the current slide when it changes
		lightbox.on('change', () => {
			emblaCarousel?.scrollTo(lightbox.pswp?.currIndex ?? 0);
		});

		// Register custom UI elements when the lightbox UI is initialized
		lightbox.on('uiRegister', () => {
			// Add a download button to the lightbox UI
			lightbox.pswp?.ui?.registerElement({
				name: 'download-button',
				order: 8, // Position in the UI
				isButton: true,
				tagName: 'button',
				html: {
					isCustomSVG: true,
					size: 24,
					inner: downloadBtnSvgPath
				},
				onClick: (_, __, pswp) => {
					showDowloadDialog();
				}
			});

			// Add a thumbnail carousel to the lightbox UI
			lightbox.pswp?.ui?.registerElement({
				appendTo: 'wrapper', // Append to the lightbox wrapper
				tagName: 'div',
				name: 'thumbs',
				onInit: (e, pswp) => {
					// Prevent pointer events from bubbling up to the lightbox
					e.style.userSelect = 'none';
					e.addEventListener('pointerup', (e) => {
						e.stopPropagation();
					});
					e.addEventListener('pointerdown', (e) => {
						e.stopPropagation();
					});

					// Create thumbnail slides for each image
					const slides = images.map((image, i) => {
						const el = document.createElement('div');
						el.style.aspectRatio = `${image.thumb.width / image.thumb.height}`;
						el.className = 'thumb-slide';
						el.addEventListener(
							'click',
							() => {
								// Navigate to the clicked thumbnail
								emblaCarousel?.scrollTo(i);
								pswp.goTo(i);
							},
							false
						);

						// Create the thumbnail image element
						const img = document.createElement('img');
						img.className = 'thumb-img';
						img.dataset.src = image.thumb.url; // Use data-src for lazy loading

						el.appendChild(img);
						return el;
					});

					// Create a container for the thumbnails
					const container = document.createElement('div');
					container.className = 'thumbs-container';
					container.append(...slides);

					e.appendChild(container);

					// Initialize the Embla carousel for thumbnails
					setTimeout(() => {
						const startIndex = pswp.currIndex % images.length;

						// Mark the current thumbnail as active
						slides.at(startIndex)?.classList.add('active');

						// Create the Embla carousel
						emblaCarousel = EmblaCarousel(e, {
							containScroll: false, // Allow scrolling beyond the edges
							startIndex, // Start at the current image index
							dragFree: true // Enable free-form dragging
						});

						// Lazy load thumbnails as they come into view
						emblaCarousel.on('slidesInView', (e) => {
							const slideNodes = e.slideNodes();
							e.slidesInView()
								.map((x) => slideNodes[x].querySelector('img'))
								.filter((x) => x != null)
								.filter((x) => !x.src)
								.forEach((x) => {
									x.src = x?.dataset.src ?? '';
								});
						});

						// Sync the lightbox with the carousel when the carousel changes
						emblaCarousel.on('select', (e) => {
							const currentIndex = e.selectedScrollSnap();

							// Update the active thumbnail
							document.querySelector('.thumb-slide.active')?.classList.remove('active');
							emblaCarousel?.slideNodes()[currentIndex]?.classList.add('active');

							// Update the lightbox if needed
							if (pswp.currIndex !== currentIndex) {
								pswp.goTo(currentIndex);
							}
						});
					}, 0);
				}
			});
		});

		// Initialize the lightbox
		lightbox.init();

		const url = new URL('https://home.ligmailcompany.com/.well-known/mercure');
		url.searchParams.append('topic', `https://chimto.com/image/update/${data.albumId}`);

		eventSource = new EventSource(url);

		eventSource.onmessage = (event) => {
			const message = JSON.parse(event.data);

			images = [
				{
					id: message.id,
					thumb: {
						url: `https://home.ligmailcompany.com/images/optimized/${message.image_thumb.name}`,
						width: message.image_thumb.width,
						height: message.image_thumb.height
					},
					raw: {
						url: `https://home.ligmailcompany.com/images/original/${message.image.name}`,
						width: message.image.width,
						height: message.image.height
					},
					isTicked: message.is_ticked ?? false
				},
				...images
			];
		};
	});

	// Clean up resources when component is destroyed
	onDestroy(() => {
		lightbox?.destroy(); // Destroy the PhotoSwipe lightbox instance
		eventSource?.close();
	});

	/**
	 * Partitions images into balanced columns for the masonry-like grid layout
	 * Uses a greedy algorithm to distribute images across columns while maintaining
	 * visual balance based on image heights
	 *
	 * @param numberOfGroups - Number of columns to create (based on screen size)
	 * @returns Array of image arrays, one per column
	 */
	function partitionData(images: AlbumImage[], numberOfGroups: number) {
		// Create a copy of the images array and sort by height (tallest first)
		const tmp = [...images];
		// tmp.sort((a, b) => b.thumb.height - a.thumb.height);

		// Initialize empty groups (columns) and their height sums
		let groups: (typeof tmp)[] = Array(numberOfGroups)
			.fill(undefined)
			.map(() => []);
		let sums: number[] = Array(numberOfGroups).fill(0);

		// Distribute images using a greedy approach
		tmp.forEach((item) => {
			// Find the column with the smallest current height
			let index = sums.indexOf(Math.min(...sums));
			// Add the image to that column
			groups[index].push(item);
			// Update the column's total height
			sums[index] += item.thumb.height;
		});

		groups = groups
			.map((x) => x.sort((a, b) => b.id - a.id))
			.sort((a, b) => (b[0]?.id ?? 0) - (a[0]?.id ?? 0));

		return groups;
	}

	/**
	 * Shows the download dialog for selected images
	 * Currently a placeholder function
	 */
	function showDowloadDialog() {
		// TODO: Implement download functionality
	}

	/**
	 * Opens the PhotoSwipe lightbox for the clicked image
	 *
	 * @param e - Click event from the image anchor element
	 */
	function showLightbox(e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
		// Get the ID of the clicked image
		const imgId = Number(e.currentTarget.dataset.id);

		// Get all image anchors and sort them by ID
		const items = [...container.querySelectorAll('a')].sort(
			(a, b) => Number(b.dataset.id) - Number(a.dataset.id)
		);

		// Create the data source for PhotoSwipe
		const dataSource: DataSourceObject = {
			gallery: container,
			items
		};

		// Open the lightbox at the index of the clicked image
		lightbox.loadAndOpen(
			images.findIndex((x) => x.id === imgId),
			dataSource
		);
	}
</script>

<!-- Set the page title -->
<svelte:head>
	<title>Album {data.albumId}</title>
</svelte:head>

<!-- Handle clicks outside the mobile selection options menu to close it -->
<svelte:window
	on:click={(e) => {
		if (
			!isMobileSelectOptionOpen ||
			(e.target instanceof Element && e.target.closest('#mobile-select-option'))
		) {
			return;
		}

		isMobileSelectOptionOpen = false;
	}}
/>

{#if images.length === 0}
	<!-- Empty state with loading animation -->
	<div class="flex min-h-[50vh] flex-col items-center justify-center py-12">
		<!-- Loading icon with animation -->
		<!-- <div class="mb-6 text-primary">
			<Icon icon={loadingIcon} class="size-20 animate-spin" />
		</div> -->

		<!-- Camera icon -->
		<div class="mb-4 text-primary">
			<Icon icon={cameraIcon} class="size-16" />
		</div>

		<!-- Loading message -->
		<h2 class="text-center text-2xl font-medium text-base-content">
			Đang đợi PTG bấm cò ra ảnh đẹp
		</h2>

		<!-- Subtitle -->
		<p class="mt-2 text-center text-base-content/70">Ảnh sẽ xuất hiện tự động khi có ảnh mới</p>
	</div>
{:else}
	<!-- ResizeWatcher component that provides responsive breakpoints -->
	<ResizeWatcher let:value>
		{#if browser}
			<!-- Calculate the number of columns based on screen size -->
			{@const partitions = partitionData(images, value > 2 ? 4 : value > 1 ? 3 : 2)}

			<!-- Main image grid container -->
			<div
				class="gap relative grid {value > 2
					? 'grid-cols-4'
					: value > 1
						? 'grid-cols-3'
						: 'grid-cols-2'} gap-x-4 py-4"
				bind:this={container}
			>
				<!-- Iterate through each column -->
				{#each partitions as partition}
					<div class="flex flex-col gap-4">
						<!-- Iterate through each image in the column -->
						{#each partition as item}
							{@const selected = selectedIds.includes(item.id)}

							<!-- Image container with selection outline -->
							<div
								class="group relative block cursor-pointer overflow-hidden rounded-lg outline outline-4 -outline-offset-4 transition-all {selected
									? 'p-2 outline-primary'
									: 'outline-transparent'}"
								style="aspect-ratio: {item.thumb.width / item.thumb.height};"
							>
								{#if item.isTicked}
									<div
										class="striped absolute left-0 top-0 flex items-center justify-center gap-2 rounded-br-lg rounded-tl-lg border-4 border-black px-4 py-2 text-white transition-opacity group-hover:opacity-30"
									>
										<Icon icon={kidstar} class="size-5 text-white" />
										<span class="text font-semibold tracking-widest">Đã chọn ảnh</span>
									</div>
								{/if}
								<!-- Share button (appears on hover) -->
								<button
									on:click|preventDefault|stopPropagation
									type="button"
									class="absolute bottom-3 right-16 flex size-10 items-center justify-center rounded-full border bg-white text-xl text-base-content opacity-0 shadow transition-all hover:brightness-90 group-hover:opacity-100 dark:text-base-100"
								>
									<Icon icon={shareIcon} />
								</button>

								<!-- Download button (appears on hover) -->
								<button
									on:click|preventDefault|stopPropagation
									type="button"
									class="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full border bg-white text-2xl text-base-content opacity-0 shadow transition-all hover:brightness-90 group-hover:opacity-100 dark:text-base-100"
								>
									<Icon icon={downloadIcon} />
								</button>

								<!-- Selection checkbox -->
								<div
									class="absolute right-2 top-2 flex size-12 items-center justify-center transition-opacity {!selected
										? 'opacity-0 group-hover:opacity-100'
										: ''}"
								>
									<button
										type="button"
										on:click|stopPropagation|preventDefault={() => {
											if (selected) {
												// Remove from selection if already selected
												selectedIds = selectedIds.filter((x) => x !== item.id);
												return;
											}

											// Add to selection if not selected
											selectedIds = [...selectedIds, item.id];
										}}
										class="rounded-full border bg-white shadow"
									>
										<Icon
											icon={checkCircleIcon}
											class="transition-all {selected
												? 'size-8 text-primary md:size-10'
												: 'size-10 text-stone-500/50 md:size-12'}"
										/>
									</button>
								</div>

								<!-- Image link that opens the lightbox -->
								<a
									on:click|preventDefault|stopPropagation={showLightbox}
									href={item.raw.url}
									class="block h-full w-full overflow-hidden rounded"
									id="image-{item.id}"
									data-pswp-src={item.raw.url}
									data-pswp-width={item.raw.width}
									data-pswp-height={item.raw.height}
									data-id={item.id}
								>
									<!-- Lazy-loaded image -->
									<img alt="" class="h-full w-full object-cover" use:lazyLoad={item.thumb.url} />
								</a>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</ResizeWatcher>
{/if}

<!-- Mobile selection options bar (appears when images are selected) -->
{#if selectedIds.length > 0}
	<div
		id="mobile-select-option"
		transition:fly={{
			duration: 200,
			y: 20,
			easing: cubicOut
		}}
		class="fixed bottom-8 left-0 right-0 mx-auto w-fit rounded-[32px] dark:bg-slate-800 px-2 py-2 shadow-lg sm:rounded-[40px] sm:px-4 sm:py-4"
	>
		<div class="flex items-center gap-4">
			<!-- Clear selection button -->
			<button
				class="btn btn-circle border-none bg-transparent text-white/60 hover:bg-error hover:text-white"
				on:click={() => {
					isMobileSelectOptionOpen = false;
					selectedIds = [];
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="3"
						d="M18 6L6 18M6 6l12 12"
					/>
				</svg>
			</button>

			<!-- Selection count display -->
			<div class="px-4 text-white">
				<span>Bạn đã chọn</span>
				<span class="badge border-none bg-white !bg-opacity-15 px-3 font-semibold text-white">
					{selectedIds.length}
				</span>
				<span>ảnh</span>
			</div>

			<!-- Desktop download options (visible on medium screens and up) -->
			<!-- <button
				class="btn hidden rounded-full border-none bg-white !bg-opacity-15 text-white md:flex"
			>
				<Icon icon={zipIcon} class="size-8 text-white/45" />
				<span>Download dưới dạng zip</span>
			</button> -->
			<button
				class="btn btn- hidden rounded-full border-none bg-white !bg-opacity-15 text-white md:flex"
			>
				<Icon icon={heartcheck} class="size-8 text-white/45" />
				<span>Tích chọn ảnh (đang phát triển nốt)</span>
			</button>

			<!-- Mobile menu toggle button (visible on small screens) -->
			<button
				class="btn btn-circle border-none bg-transparent !bg-opacity-15 text-white/60 hover:bg-white hover:text-white md:hidden"
				on:click={() => (isMobileSelectOptionOpen = !isMobileSelectOptionOpen)}
			>
				<Icon icon={menuIcon} class="size-6" />
			</button>
		</div>

		<!-- Mobile download options dropdown (visible when toggled) -->
		<div>
			{#if isMobileSelectOptionOpen}
				<div class="flex flex-col md:hidden" transition:slide={{ duration: 200 }}>
					<!--<button
						class="btn mt-2 justify-between rounded-full border-none bg-white !bg-opacity-15 text-white"
					>
						<Icon icon={zipIcon} class="size-8 text-white/45" />
						<span class="flex-1 text-center">Download dưới dạng zip</span>
					</button> -->
					<button
						class="btn mt-2 justify-between rounded-full border-none bg-white !bg-opacity-15 text-white"
					>
						<Icon icon={heartcheck} class="size-8 text-white/45" />
						<span>Tích chọn ảnh (đang phát triển nốt)</span>
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	/* Add drop shadow to PhotoSwipe buttons for better visibility */
	:global(.pswp__button) {
		filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.2)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.6));
	}

	/* Thumbnail carousel styling in the lightbox */
	:global(.pswp__thumbs) {
		/* Position the thumbnails at the bottom of the lightbox */
		@apply absolute bottom-[5%] left-0 right-0 flex justify-center overflow-hidden sm:bottom-2;

		/* Container for the thumbnail slides */
		:global(.thumbs-container) {
			@apply flex gap-2 rounded-xl bg-slate-950/70 p-2;

			/* Individual thumbnail slide */
			:global(.thumb-slide) {
				@apply h-20 cursor-pointer overflow-hidden rounded;

				/* Thumbnail image */
				:global(.thumb-img) {
					@apply h-full w-full object-cover;
				}
			}

			/* Dim thumbnails that are not active */
			:global(.thumb-slide:not(.active)) {
				@apply brightness-75;
			}
		}
	}
</style>
