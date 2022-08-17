import { writable } from 'svelte/store';
import { browser } from '$app/env';

// checks if user has verified their age
function checkVerified(): boolean {
  if (browser) {
    const verified = localStorage.getItem('verifiedAge') === 'true'

    // initialises variable if it's not
    if (verified == null) {
      localStorage.setItem('verifiedAge', 'false')
    }

    return verified;
  }

  return false
}

const verifiedAge = writable<boolean>(checkVerified());

// sets local storage item everytime the value changes
verifiedAge.subscribe((value) => {
  if (browser) {
    localStorage.setItem('verifiedAge', value.toString());
  }
});

export { verifiedAge as default };
