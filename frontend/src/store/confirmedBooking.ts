import { writable } from 'svelte/store';

// temporarily stores the details of a confirmed booking to display
// in the restaurant/booking/complete page.
const confirmedBooking = writable(null)

export { confirmedBooking as default };
