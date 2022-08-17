<script lang="ts">
  // displays a spinner and overlays the screen
  // for use while awaiting API responses
  import CircularProgress from "@smui/circular-progress";
  import loading from "../store/loading";
  import { fade } from "svelte/transition";

  const spinnerSize = "60px";

  let display = false;
  $: display = $loading;
</script>

{#if display}
  <div transition:fade={{ duration: 150 }} class="overlay">
    <CircularProgress
      style="height: {spinnerSize}; width: {spinnerSize};"
      indeterminate
    />
  </div>
{/if}

<style lang="scss">
  .overlay {
    position: fixed;
    top: 0;
    @include col;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 99;
  }
</style>
