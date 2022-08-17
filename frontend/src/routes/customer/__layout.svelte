<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";

  export async function load({ url, session }: LoadInput): Promise<LoadOutput> {
    // check if member is not logged in
    if (!session.accessToken) {
      return {
        status: 302,
        redirect: `/signin?ref=${url.pathname}`,
      };
    }

    return {
      props: {
        member: session.user,
      },
    };
  }
</script>

<script lang="ts">
  import { page } from "$app/stores";
  export let member: User;
</script>

<header>
  <h1>Hello, {member?.firstName}</h1>
  <ul>
    <li>
      <a
        sveltekit:prefetch
        class={$page.url.pathname === "/customer/bookings" ? "active" : ""}
        href="/customer/bookings">Bookings</a
      >
    </li>
    <li>
      <a
        sveltekit:prefetch
        class={$page.url.pathname === "/customer/orders" ? "active" : ""}
        href="/customer/orders">Orders</a
      >
    </li>
    <li>
      <a
        class={$page.url.pathname === "/customer/account" ? "active" : ""}
        href="/customer/account">Account</a
      >
    </li>
  </ul>
</header>

<slot />

<style lang="scss">
  header {
    @include section-width;
    padding-left: 0;
    padding-right: 0;

    h1 {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
      font-size: 3rem;
    }

    ul {
      display: flex;
      width: 100%;
      background-color: #ddd;
    }

    li,
    a {
      display: inline-block;
      width: 100%;
      text-align: center;
    }

    li:first-of-type a:not(.active) {
      border-right: 2px solid #aaa;
    }

    li:last-of-type a:not(.active) {
      border-left: 2px solid #aaa;
    }

    a {
      border-top: 2px solid #ddd;
      padding: 0.8rem 1rem;
      color: #777;
      text-decoration: none;
    }
  }

  .active {
    border-color: rgb(43, 110, 255);
    color: #000;
    font-weight: 550;
    background-color: #eee;
  }
</style>
