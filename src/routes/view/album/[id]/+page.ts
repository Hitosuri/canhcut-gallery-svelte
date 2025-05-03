/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PageLoad } from './$types';

/**
 * Page load function for the album view
 * Fetches image data from Danbooru API and transforms it into the format needed by the page
 */
export const load: PageLoad = async ({ fetch }) => {
	// Set up query parameters for the API request
	const params = new URLSearchParams();
	params.set('limit', '200'); // Request 200 images maximum
	params.set('tags', 'rating:general'); // Only get images with general rating (safe for viewing)

	// Fetch data from Danbooru API
	const r = await fetch(`https://danbooru.donmai.us/posts.json?${params}`);

	// Return empty array if the request failed
	if (!r.ok) {
		return {
			images: []
		};
	}

	// Parse the JSON response
	const data = await r.json();

	// Transform the API data into our application's format
	const images: AlbumImage[] = data
		// Filter out entries without media assets or variants
		.filter((x: any) => x.media_asset?.variants)
		// Map each image to our application's format
		.map((x: any, i: number) => {
			// Find the thumbnail variant (720x720)
			const thumb = x.media_asset.variants.find((x: any) => x.type === '720x720');
			// Find the original size variant
			const raw = x.media_asset.variants.find((x: any) => x.type === 'original');

			// Return the formatted image object
			return {
				id: i + 1, // Assign sequential IDs starting from 1
				thumb: {
					url: thumb.url,
					width: thumb.width,
					height: thumb.height
				},
				raw: {
					url: raw.url,
					width: raw.width,
					height: raw.height
				}
			} satisfies AlbumImage;
		});

	// Return the processed images to the page
	return {
		images
	};
};
