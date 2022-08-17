<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  import { BASE_URL, setAuthorization } from "$lib/util/api";

  const URL = `${BASE_URL}/restaurant/book`;

  export async function load({
    session,
    url,
    fetch,
  }: LoadInput): Promise<LoadOutput> {
    // check if member is logged in
    if (!session.accessToken) {
      return {
        status: 302,
        redirect: `/signin?ref=${url.pathname}`,
      };
    }

    // set access token in headers so the backend can identify which
    // member to retrieve the bookings for.
    const res = await fetch(URL, setAuthorization(session.accessToken));

    if (res.ok) {
      const data = await res.json();
      const bookings = data.bookings;
      console.log(
        `GET > /restaurant/book success, retrieved ${bookings.length} items`
      );

      // passes the bookings data to the page
      return {
        props: { bookings },
      };
    }

    // returns an error if the data could not be retrieved / parsed
    return {
      status: res.status,
      error: new Error(`Could not load ${URL}`),
    };
  }
</script>

<script lang="ts">
  import { currentPageTitle } from "../../store/index";
  import BookingList from "$lib/BookingList.svelte";
  $currentPageTitle = "Bookings";

  export let bookings: Booking[];
</script>

<svelte:head>
  <title>Your Bookings – Orchard Pig</title>
</svelte:head>

<section>
  <BookingList {bookings} />
</section>

<style lang="scss">
  section {
    text-align: center;
    margin: 3rem 0;
    padding-left: 1rem;
    padding-right: 1rem;
    max-width: 700px;
  }
</style>
