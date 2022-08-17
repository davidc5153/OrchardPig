import { writable } from 'svelte/store';

// set store to true to display a loading screen
export const loading = writable(false)

export { loading as default };
