import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import daisyui, { Config as DaisyConfig } from 'daisyui';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				inter: [
					'Inter, sans-serif',
					{
						fontFeatureSettings: '"cv01", "cv02", "cv03", "cv04", "cv08", "cv11", "tnum"'
					}
				]
			},
			spacing: {
				'scroll-bar': 'var(--scrollbar-width, 0)'
			}
		}
	},
	plugins: [forms, typography, aspectRatio, containerQueries, daisyui],
	daisyui: {
		themes: [
			{
				custom: {
					primary: '#1a3a89',
					'primary-focus': '#3c61be',
					'primary-content': '#ffffff',

					secondary: '#1a3a89',
					'secondary-focus': '#142d66',
					'secondary-content': '#ffffff',

					accent: '#4a72cf',
					'accent-focus': '#385db2',
					'accent-content': '#ffffff',

					neutral: '#3b424e',
					'neutral-focus': '#2a2e37',
					'neutral-content': '#ffffff',

					'base-100': '#ffffff',
					'base-200': '#f9fafb',
					'base-300': '#ced3d9',
					'base-content': '#1e2734',

					info: '#1c92f2',
					success: '#009485',
					warning: '#ff9900',
					error: '#dc3545',

					'--rounded-box': '20px',
					'--rounded-btn': '.5rem',
					'--rounded-badge': '1.9rem',

					'--animation-btn': '.25s',
					'--animation-input': '.2s',

					'--btn-text-case': 'uppercase',
					'--navbar-padding': '0.5rem',
					'--border-btn': '1px'
				},

				darkcustom: {
					primary: '#142d66',
					'primary-focus': '#ffffff',
					'primary-content': '#ffffff',

					secondary: '#1a3a89',
					'secondary-focus': '#142d66',
					'secondary-content': '#ffffff',

					accent: '#4a72cf',
					'accent-focus': '#385db2',
					'accent-content': '#ffffff',

					neutral: '#ffffff',
					'neutral-focus': '#2a2e37',
					'neutral-content': '#ffffff',

					'base-100': '#030712',
					'base-200': '#f9fafb',
					'base-300': '#ced3d9',

					'base-content': '#ffffff',

					info: '#1c92f2',
					success: '#009485',
					warning: '#ff9900',
					error: '#dc3545',

					'--rounded-box': '20px',
					'--rounded-btn': '.5rem',
					'--rounded-badge': '1.9rem',

					'--animation-btn': '.25s',
					'--animation-input': '.2s',

					'--btn-text-case': 'uppercase',
					'--navbar-padding': '0.5rem',
					'--border-btn': '1px'
				},
			}
		],
		darkTheme: 'darkcustom'
	}
} satisfies Config & { daisyui: DaisyConfig };
