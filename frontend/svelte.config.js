import adapter from '@sveltejs/adapter-vercel'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		// Allows SCSS variables and mixins to be accessed globally
		scss: {
			prependData: `@import './src/scss/utils/_vars.scss'; @import './src/scss/utils/_mixins.scss';`,
			renderSync: true
		}
	}),
	kit: {
		adapter: adapter(),
		// Reference: https://gitanswer.com/kit-issue-with-using-commonjs-modules-in-svelte-kit-build-javascript-853301167
		vite: {
			ssr: {
				noExternal: ['@googlemaps/js-api-loader']
			}
		}
	}
}

export default config
