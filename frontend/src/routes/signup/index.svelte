<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";

  export async function load({ session }: LoadInput): Promise<LoadOutput> {
    // check if user is logged in
    if (session.accessToken) {
      return {
        status: 302,
        redirect: "/customer/bookings",
      };
    }

    return {
      props: {},
    };
  }
  export const prerender = true;
</script>

<script lang="ts">
  import { currentPageTitle } from "../../store/index";
  import SignUpForm from "$lib/forms/SignUpForm.svelte";
  $currentPageTitle = "Sign Up";
</script>

<svelte:head>
  <title>Sign Up – Orchard Pig</title>
</svelte:head>

<section>
  <h1>Create new account</h1>
  <SignUpForm />
</section>

<style lang="scss">
  section {
    @include col;
    align-items: center;
    --margin: 2rem;
    margin-top: var(--margin);
    margin-bottom: var(--margin);
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;

    @include for-tablet-up {
      --margin: 3rem;
    }
  }

  h1 {
    margin-bottom: 2rem;
    font-size: 3rem;

    @include for-tablet-up {
      font-size: 4rem;
    }
  }
</style>
