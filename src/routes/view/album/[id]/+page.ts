/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PageLoad } from './$types';

/**
 * Page load function for the album view
 * Fetches image data from the API and transforms it into the format needed by the page
 */
export const load: PageLoad = async ({ fetch, params }) => {
	const r = await fetch(`https://home.ligmailcompany.com/customer/image/${params.id}`);
	let images: AlbumImage[] = [];

	if (r.status === 200) {
		const data = await r.json();
		images = data.customer_image[0].images
			.map((x: any) => {
				// Return the formatted image object
				return {
					id: x.id, // Assign sequential IDs starting from 1
					thumb: {
						url: `https://home.ligmailcompany.com/images/optimized/${x.imageOptimized.imageNameOptimized}`,
						width: x.imageOptimized.image_width,
						height: x.imageOptimized.image_height
					},
					raw: {
						url: `https://home.ligmailcompany.com/images/original/${x.imageName}`,
						width: x.image_width,
						height: x.image_height
					}
				} satisfies AlbumImage;
			})
			.sort((a: AlbumImage, b: AlbumImage) => b.id - a.id);
	}

	// Return the processed images to the page
	return {
		images,
		albumId: params.id
	};
};
