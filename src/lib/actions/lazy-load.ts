/**
 * Lazy Load Action
 *
 * A Svelte action that implements lazy loading for images using the Intersection Observer API.
 * This action delays loading images until they are about to enter the viewport,
 * improving initial page load performance by reducing the number of initial HTTP requests.
 *
 * Features:
 * - Only loads images when they approach the viewport
 * - Automatically cleans up observers when elements are destroyed
 * - Handles dynamic source updates
 * - Only runs in browser environments (SSR safe)
 *
 * Usage example:
 * <img alt="Description" use:lazyLoad={imageUrl} />
 */

// Import browser environment from Svelte Kit
import { browser } from '$app/environment';
import type { Action } from 'svelte/action';

/**
 * Svelte action for lazy loading images
 *
 * @param el - The HTML image element to apply lazy loading to
 * @param src - The source URL of the image to load when visible
 * @returns An action object with destroy and update methods
 */
export const lazyLoad: Action<HTMLImageElement, string> = (el, src) => {
	// Track the current source URL (needed for updates)
	let currentSrc = src;
	// Track whether the image has been loaded
	let isLoaded = false;

	// Only run in browser environment (not during SSR)
	if (browser) {
		// Create an Intersection Observer to detect when the image enters the viewport
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					// When the image is visible in the viewport
					if (entry.isIntersecting) {
						// Mark as loaded
						isLoaded = true;
						// Set the src attribute to load the image
						el.src = currentSrc;
						// Stop observing once loaded
						observer.unobserve(el);
					}
				});
			},
			// rootMargin of 50% means the image starts loading when it's within 50% of the viewport height
			{ rootMargin: '50% 0px' }
		);

		// Start observing the image element
		observer.observe(el);

		// Return the action methods
		return {
			/**
			 * Clean up the observer when the element is removed from the DOM
			 */
			destroy() {
				if (observer) {
					observer.unobserve(el);
				}
			},

			/**
			 * Handle updates to the src parameter
			 *
			 * @param newSrc - The new image source URL
			 */
			update(newSrc: string) {
				// Update the current source
				currentSrc = newSrc;

				// If the image is already loaded, update the src immediately
				// Otherwise, it will be updated when the image enters the viewport
				if (isLoaded) {
					el.src = currentSrc;
				}
			}
		};
	}
};
