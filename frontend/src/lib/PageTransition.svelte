<script lang="ts">
  import { fly } from "svelte/transition";
  export let refresh = "";

  // the time taken for the page outro animation
  let outDuration = 150;
  // the time taken for the page intro animation
  let inDuration = 500;
</script>

{#key refresh}
  <div
    in:fly={{ y:-5, duration: inDuration, delay: outDuration }}
    out:fly={{ duration: outDuration }}
    class="page-content"
  >
    <slot />
  </div>
{/key}

<style>
  .page-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
