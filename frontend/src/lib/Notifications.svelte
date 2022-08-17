<script lang="ts">
  import Kitchen, { Config, KitchenComponentDev } from "@smui/snackbar/kitchen";
  import { setContext } from "svelte";
  let kitchen: KitchenComponentDev;

  // Stores the notify method so other pages can use it
  setContext("notify", {
    notifyUser: (config: Config) => kitchen.push(config),
  });
</script>

<!-- passess the context down to other components -->
<slot />
<Kitchen bind:this={kitchen} dismiss$class="material-icons" />
