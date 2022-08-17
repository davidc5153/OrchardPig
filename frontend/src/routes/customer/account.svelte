<script lang="ts">
  import { currentPageTitle } from "../../store/index";
  import UserDetails from "$lib/forms/UserDetails.svelte";
  import UserAddress from "$lib/forms/UserAddress.svelte";
  $currentPageTitle = "Your Account";

  let editingUser = false;
  let editingAddress = false;
</script>

<svelte:head>
  <title>Edit Account Details – Orchard Pig</title>
</svelte:head>

{#if !editingAddress}
  <section>
    <UserDetails bind:editing={editingUser} />
  </section>
{/if}

{#if !editingUser}
  <section>
    <UserAddress bind:editing={editingAddress} />
  </section>
{/if}

<style lang="scss">
  section {
    margin-top: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    max-width: 500px;
  }
</style>
