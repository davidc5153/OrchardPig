<script context="module" type="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";

  export async function load({ session }: LoadInput): Promise<LoadOutput> {
    // skip this page if user is logged in
    if (session.accessToken) {
      return {
        status: 302,
        redirect: "/checkout/delivery",
      };
    }

    if (session.accessToken && session.cart.length < 1) {
      return {
        status: 302,
        redirect: `/cart`,
      };
    }

    return {
      props: {},
    };
  }

  const ref = "/checkout/delivery";
</script>

<script>
  import { session } from "$app/stores";
  import SignInForm from "$lib/forms/SignInForm.svelte";

  async function submitHandler() {}
</script>

<svelte:head>
  <title>Sign In Or Continue As Guest – Orchard Pig</title>
</svelte:head>

<section class="checkout-options">
  <div class="member">
    <h1 >Sign in for faster check out</h1>
    <SignInForm {ref} />
  </div>

  <div class="guest">
    <h2>Guest Checkout</h2>
    <a href={ref} title="Link to guest checkout page">Continue as guest</a>
  </div>
</section>

<style lang="scss">
  section {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-left: 1rem;
    padding-right: 1rem;
    max-width: unset;
  }

  h1,
  h2 {
    margin-top: 0;
    padding-left: 0;
    padding-right: 0;
    font-size: 3rem;
  }

  .member,
  .guest {
    margin-top: 2rem;
  }

  .guest {
    margin-bottom: 2rem;
    text-align: center;
  }
</style>
