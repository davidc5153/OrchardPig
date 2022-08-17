<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";

  export async function load({ url, session }: LoadInput): Promise<LoadOutput> {
    // check if user is logged in
    if (session.accessToken) {
      return {
        status: 302,
        redirect: "/customer",
      };
    }

    return {
      props: {
        ref: url.searchParams.get("ref"),
      },
    };
  }
</script>

<script lang="ts">
  import SignInForm from "$lib/forms/SignInForm.svelte";
  import { currentPageTitle } from "../../store/index";
  $currentPageTitle = "Sign In";

  // pathname before user was redirected to this page
  export let ref: string;
</script>

<svelte:head>
  <title>Sign In – Orchard Pig</title>
</svelte:head>

<section>
  <h1>Sign in</h1>
  <SignInForm {ref} />
</section>

<style lang="scss">
  section {
    width: 100%;
    max-width: 450px;
    padding: 1rem;

    h1 {
      margin-top: 1.5rem;
      margin-bottom: 3rem;
      font-size: 4rem;
    }
  }
</style>
