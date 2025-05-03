/* eslint-disable @typescript-eslint/no-explicit-any */
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/**
 * Page load function for the album view
 * Fetches image data from the API and transforms it into the format needed by the page
 *
 * Error handling:
 * - 404: Album not found - Throws a 404 error that will be caught by the error page
 * - 403: Unauthorized - Throws a 403 error for permission issues
 * - Other errors: Throws a generic error with the appropriate status code
 */
export const load: PageLoad = async ({ fetch, params }) => {
	// Validate the album ID parameter (optional)
	if (!params.id) {
		error(400, 'ID album không hợp lệ');
	}

	const r = await fetch(`https://home.ligmailcompany.com/customer/image/${params.id}`);
	let images: AlbumImage[] = [];

	// Handle specific error cases
	if (r.status === 404 || r.status === 204) {
		error(404, 'Album không tồn tại hoặc đã bị xóa');
	}

	if (r.status === 403) {
		error(403, 'Bạn không có quyền xem album này');
	}

	if (!r.ok) {
		error(r.status, `Đã có lỗi xảy ra khi tải album: ${r.statusText}`);
	}

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
					},
					isTicked: x.is_ticked ?? false
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
