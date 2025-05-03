// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface PageState {}
	// interface Platform {}
}

interface ServiceItem {
	name: string;
	description: string;
	icon: import('@iconify/svelte').IconifyIcon;
	sizeInPx?: number;
}

interface AlbumImage {
	id: number;
	thumb: ImageVariant;
	raw: ImageVariant;
	isTicked: boolean;
}

interface ImageVariant {
	url: string;
	width: number;
	height: number;
}
