<script lang="ts">
	/**
	 * ResizeWatcher Component
	 *
	 * A utility component that watches for window resize events and provides
	 * a responsive breakpoint value to its children through a slot prop.
	 *
	 * The component:
	 * - Monitors window resize events
	 * - Debounces the resize handler to improve performance
	 * - Converts window width to a numeric value based on breakpoints
	 * - Passes the current breakpoint value to child components
	 * - Dispatches a 'resize' event when the breakpoint changes
	 *
	 * Usage example:
	 * <ResizeWatcher let:value>
	 *   <div class={value > 2 ? 'large' : value > 1 ? 'medium' : 'small'}>
	 *     Responsive content
	 *   </div>
	 * </ResizeWatcher>
	 */
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';

	// Component props with default values
	/**
	 * Array of width breakpoints in pixels, in ascending order
	 * Default breakpoints match common Tailwind CSS breakpoints:
	 * - 640px: Small screens (sm)
	 * - 768px: Medium screens (md)
	 * - 1024px: Large screens (lg)
	 * - 1280px: Extra large screens (xl)
	 * - 1536px: 2x extra large screens (2xl)
	 */
	export let breakpoints: number[] = [640, 768, 1024, 1280, 1536];

	/**
	 * Time in milliseconds to wait after the last resize event before updating
	 * Used to prevent excessive calculations during continuous resize
	 */
	export let debounceTime = 100;

	// Create event dispatcher for the resize event
	const dispatch = createEventDispatcher<{
		resize: number;
	}>();

	// Filter out invalid breakpoints (must be positive) and sort in descending order
	// for easier comparison in the widthToValue function
	let validatedBreakpoints = breakpoints.filter((x) => x > 0).sort((a, b) => b - a);

	// Initialize the breakpoint value based on current window width (or 0 if SSR)
	let value = widthToValue(browser ? window.innerWidth : 0);
	let lastValue = value;
	let timer: number | undefined;

	// Dispatch initial resize event when component mounts
	onMount(() => {
		dispatch('resize', value);
	});

	/**
	 * Window resize event handler
	 * Debounces the resize event to prevent excessive calculations
	 *
	 * @param e - The resize event object
	 */
	function onResize(e: UIEvent & { currentTarget: EventTarget & Window }) {
		// Clear any existing timer to implement debouncing
		if (timer) {
			clearTimeout(timer);
			timer = undefined;
		}

		const windowWidth = e.currentTarget.innerWidth;

		// Set a new timer to update the value after the debounce period
		timer = setTimeout(() => {
			const newValue = widthToValue(windowWidth);

			// Only update and dispatch if the value has changed
			if (newValue !== lastValue) {
				value = newValue;
				dispatch('resize', newValue);
				lastValue = value;
			}
		}, debounceTime);
	}

	/**
	 * Converts a window width in pixels to a breakpoint value
	 *
	 * The returned value represents which breakpoint range the width falls into:
	 * - 0: Width is smaller than the smallest breakpoint
	 * - 1: Width is between the smallest and second smallest breakpoint
	 * - 2, 3, etc.: Width is between subsequent breakpoints
	 * - breakpoints.length: Width is larger than the largest breakpoint
	 *
	 * @param width - The window width in pixels
	 * @returns A numeric value representing the current breakpoint range
	 */
	function widthToValue(width: number) {
		// Find the index of the first breakpoint that is smaller than the current width
		const x = validatedBreakpoints.findIndex((x) => width > x);

		// If no breakpoint is smaller than the width, return 0
		if (x < 0) {
			return 0;
		}

		// Convert the index to a value that increases with window size
		return validatedBreakpoints.length - x;
	}
</script>

<!-- Listen for window resize events -->
<svelte:window on:resize={onResize} />

<!-- Pass the current breakpoint value to child components -->
<slot {value} />
