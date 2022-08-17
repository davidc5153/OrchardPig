<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";

  export async function load({ session }: LoadInput): Promise<LoadOutput> {
    // check if user is logged in
    if (session.accessToken) {
      return {
        props: {},
      };
    }

    return {
      status: 302,
      redirect: "/signup",
    };
  }
</script>

<script lang="ts">
  import BookBtn from "$lib/buttons/BookBtn.svelte";
  import ShopBtn from "$lib/buttons/ShopBtn.svelte";
  import { session } from "$app/stores";
  import { Icon } from "@smui/common";

  const fullName = `${$session.user.firstName} ${$session.user.lastName}`;
</script>

<svelte:head>
  <title>Welcome, {fullName} – Orchard Pig</title>
</svelte:head>

<section>
  <Icon
    style="font-size: 10rem; margin-bottom: 1rem; color: green;"
    class="material-icons">check_circle_outline</Icon
  >
  <h1>You're all set up!</h1>
  <p>Visit our online shop or book a place at our restaurant.</p>
  <div class="btns">
    <ShopBtn label="Shopping" />
    <BookBtn label="Restaurant" />
  </div>
</section>

<style>
  section {
    margin-top: 2rem;
    margin-bottom: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: center;
  }

  h1,
  p {
    padding-left: 0;
    padding-right: 0;
  }

  h1 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
  }

  p {
    margin-bottom: 2.5rem;
    max-width: 300px;
  }

  .btns {
    display: flex;
    justify-content: center;
    column-gap: 2rem;
  }
</style>
