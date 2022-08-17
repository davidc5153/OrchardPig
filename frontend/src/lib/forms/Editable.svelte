<script lang="ts">
  import Button, { Label } from "@smui/button";
  import ErrorMessage from "$lib/InlineNotification.svelte";
  import { getContext } from "svelte";
  import Icon from "@smui/textfield/icon";
  import loading from "../../store/loading";
  const { notifyUser } = getContext("notify");

  export let type = "";
  export let editing = false;
  export let saveChanges: () => Promise<void>;
  export let discardChanges: () => void;

  let errorTitle = "Error";
  let errorMessage: string | null;
  $: errorMessage = null;

  function closeEditing() {
    errorMessage = null;
    editing = false;
    discardChanges();
  }

  export async function submitHandler() {
    // reset error message
    errorMessage = null;

    $loading = true;

    await saveChanges()
      .then(() => {
        closeEditing();
      })
      .catch((error) => {});

    $loading = false;
  }

  import { fade } from "svelte/transition";
  const duration = 0;
</script>

{#if editing}
  <form
    on:submit|preventDefault
    in:fade={{ duration: duration, delay: duration }}
    out:fade={{ duration: duration }}
  >
    <slot name="formFields" />

    <ErrorMessage display={errorMessage} label={errorTitle}
      >{errorMessage}</ErrorMessage
    >

    <div class="submit-group">
      <Button
        on:click={closeEditing}
        color="secondary"
        variant="raised"
        title="Undo changes to {type} details"
      >
        <Label style="font-weight: 500;">Back</Label>
      </Button>
      <Button
        on:click={submitHandler}
        variant="raised"
        title="Save changes to {type} details"
      >
        <Label>Save changes</Label>
      </Button>
    </div>
  </form>
{:else}
  <div
    class="user"
    in:fade={{ duration: duration, delay: duration }}
    out:fade={{ duration: duration }}
  >
    <slot name="details" />

    <Button
      on:click={() => (editing = true)}
      class="edit-btn"
      title="Edit {type} details"
    >
      <Label>Edit</Label>
    </Button>
  </div>
{/if}

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 450px;
  }
  .user {
    display: inline-flex;
    column-gap: 1.5rem;
    align-items: flex-end;
    @include for-tablet-up {
      column-gap: 3rem;
    }
  }

  .submit-group {
    display: flex;
    justify-content: space-between;
    column-gap: 2rem;
  }
</style>
