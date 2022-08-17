<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  import { BASE_URL, setAuthorization } from "$lib/util/api";

  const URL = `${BASE_URL}/order`;

  // runs on the server and on the client.
  // can only be used in 'script context="module"
  // https://kit.svelte.dev/docs/loading
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
    // member to retrieve the orders for.
    const res = await fetch(URL, setAuthorization(session.accessToken));

    if (res.ok) {
      const data = await res.json();
      const orders = data.orders;
      console.log(`GET > /order success, retrieved ${orders.length} items`);

      // passes the orders data to the page
      return {
        props: { orders },
      };
    }

    // returns an error if the data could not be retrieved / parsed
    return {
      status: res.status,
      error: new Error(`Could not load ${URL}`),
    };
  }

  // can only prerender pages where two people visiting a page will
  // see the exact same content.
  // https://kit.svelte.dev/docs/appendix#prerendering
  // export const prerender = true;
</script>

<script lang="ts">
  import OrderList from "$lib/OrderList.svelte";
  import { currentPageTitle } from "../../../store/index";
  $currentPageTitle = "Your Orders";

  // expects to receive the orders from the code in the script block above.
  // has a default value of an empty array if none are received.
  export let orders: Order[] = [];
</script>

<svelte:head>
  <title>Your Orders – Orchard Pig</title>
</svelte:head>

<section>
  <!-- passes the order data to the list component -->
  <OrderList {orders} />
</section>

<style lang="scss">
  section {
    text-align: center;
    margin: 3rem 0;
    padding-left: 1rem;
    padding-right: 1rem;
  }
</style>
