<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  export async function load({ session }: LoadInput): Promise<LoadOutput> {
    if (session.accessToken && session.cart.length < 1) {
      return {
        status: 302,
        redirect: `/cart`,
      };
    }

    if (session.accessToken && !session.delivery) {
      return {
        status: 302,
        redirect: `/checkout/delivery`,
      };
    }

    return {
      props: {},
    };
  }
</script>

<script lang="ts">
  import Button, { Label } from "@smui/button";
  import PaymentForm from "$lib/forms/PaymentForm.svelte";
</script>

<svelte:head>
  <title>Payment Details – Orchard Pig</title>
</svelte:head>

<section>
  <h1>Payment information</h1>
  <PaymentForm />
</section>

<style lang="scss">
  section {
    @include section-width;
    @include center-margins;
    padding: 1rem;
  }

  h1 {
    font-size: 4rem;
  }
</style>
