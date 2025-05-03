import { browser } from '$app/environment';
import type { Action } from 'svelte/action';

export const lazyLoad: Action<HTMLImageElement, string> = (el, src) => {
	if (browser) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						el.src = src;
						observer.unobserve(el);
					}
				});
			},
			{ rootMargin: '50% 0px' }
		);
		observer.observe(el);

		return {
			destroy() {
				if (observer) {
					observer.unobserve(el);
				}
			}
		};
	}
};
