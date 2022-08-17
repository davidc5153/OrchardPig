<script lang="ts">
  import { browser } from "$app/env";
  import Fab, { Icon } from "@smui/fab";
  import { fly } from "svelte/transition";

  const PAGE_PORTION = 4;

  $: scrolledDown = false;

  // listen to user scrolling.
  if (browser) {
    window.addEventListener("scroll", () => {
      scrolledDown = window.scrollY >= window.innerHeight / PAGE_PORTION;
    });
  }

  // return to the top of the page smoothly.
  function goToTop() {
    document.body.scrollIntoView({
      behavior: "smooth",
    });
  }
</script>

{#if scrolledDown}
  <div transition:fly={{ y: 10, duration: 250 }} class="wrapper">
    <Fab on:click={goToTop} color="secondary" title="Go to top of page">
      <Icon class="material-icons">arrow_upward</Icon>
    </Fab>
  </div>
{/if}
