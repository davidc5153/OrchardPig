<script context="module" lang="ts">
  import type { ErrorLoadInput } from "@sveltejs/kit";
  export function load({ error, status }: ErrorLoadInput) {
    return {
      props: {
        status: status,
        error: error,
      },
    };
  }
</script>

<script lang="ts">
  export let status: string;
  export let error: { message: string };
  import HomeBtn from "$lib/buttons/HomeBtn.svelte";
  import { currentPageTitle } from "../store/index";
  $currentPageTitle = "Something went wrong";
</script>

<svelte:head>
  <title>{status} – Orchard Pig</title>
</svelte:head>

<section>
  <h1>{status}</h1>
  <p>{error.message}</p>
  <HomeBtn />
</section>

<style>
  section {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }
</style>
