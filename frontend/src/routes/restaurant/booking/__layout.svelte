<script context="module" lang="ts">
  import { page } from "$app/stores";

  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  export async function load({}: LoadInput): Promise<LoadOutput> {
    return {
      props: {},
    };
  }

  const parentDir = "/restaurant/booking";
  const steps = [
    {
      title: "Date & Time",
      pathname: `${parentDir}`,
    },
    {
      title: "Details",
      pathname: `${parentDir}/details`,
    },
    {
      title: "Review",
      pathname: `${parentDir}/review`,
    },
  ];

  const pathnames = steps.map((page) => {
    return page.pathname;
  });
</script>

{#if pathnames.includes($page.url.pathname)}
  <header>
    {#each steps as step}
      <span class:active={$page.url.pathname === step.pathname}
        >{step.title}</span
      >
    {/each}
  </header>
{/if}

<slot />

<style lang="scss">
  header {
    display: flex;
    padding: 1rem;
    width: 100%;
    max-width: 800px;
    overflow-x: auto;

    span {
      padding: 0.5rem 1rem;
      border-top: 4px solid #e0e0e0;
      flex-grow: 1;
      text-align: center;
      &.active {
        border-top-color: #0064ff;
      }
    }
  }
</style>
