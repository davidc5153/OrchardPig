<script lang="ts">
  import Icon from "@smui/textfield/icon";
  import { fade } from "svelte/transition";

  // hides error message while property is uninitialised
  export let display: any | null = null;

  // set a label attribute on the component to display a title.
  // default is no title.
  export let label = "";

  // valid types are: 'success', 'warning', 'error'.
  // default is error.
  export let type = "error";
</script>

{#if display}
  <div transition:fade={{ duration: 200 }} class="inline-notification {type}">
    <Icon class="material-icons">
      {#if type === "success"}
        check_circle
      {:else}
        {type}
      {/if}
    </Icon>
    <div class="message">
      {#if label && label.length > 0}
        <h2>{label}</h2>
      {/if}
      <span><slot /></span>
    </div>
  </div>
{/if}

<style lang="scss">
  * :global(.material-icons) {
    display: inline-block;
    padding: 0;
    align-self: flex-start;
  }

  .inline-notification {
    --color: var(--error-color);
    --bg-color: #393939;
    --text-color: #eee;

    display: flex;
    border-left: solid 4px var(--color);
    margin-bottom: 2rem;
    padding: 1rem 1rem 1rem 0.9rem;
    color: var(--color);
    background-color: var(--bg-color);

    .message {
      padding-left: 0.9rem;
    }

    h2 {
      margin-bottom: 0.2rem;
      padding-left: 0;
      padding-right: 0;
      text-align: left;
      text-transform: unset;
      font-family: var(--font-family-secondary);
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-color);
    }

    span {
      color: var(--text-color);
      font-size: 0.8rem;
    }
  }

  .warning {
    --color: #f9c000;
    --bg-color: #fff8de;
    --text-color: #161617;
  }

  .success {
    --color: #42be65;
    --bg-color: #d7fce4;
    --text-color: #161617;
  }
</style>
