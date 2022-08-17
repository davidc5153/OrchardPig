<script lang="ts">
  import Button, { Label } from "@smui/button";
  import AccountSystem from "$lib/controllers/AccountSystem";
  import { goto } from "$app/navigation";
  import ErrorMessage from "$lib/InlineNotification.svelte";
  import { getContext } from "svelte";
  import EmailField from "./EmailField.svelte";
  import PasswordField from "./PasswordField.svelte";
  import BirthdayField from "./BirthdayField.svelte";
  import NameFields from "./NameFields.svelte";
  import PhoneField from "./PhoneField.svelte";
  import loading from "../../store/loading";
  const { notifyUser } = getContext("notify");

  // fields used by sign up form
  let firstName: string;
  let lastName: string;
  let dob: string;
  let phone: string;
  let checkValidAge: () => boolean;
  let personalDetailsComplete = false;

  let email = "";
  let password = "";

  let errorTitle = "Error";
  let errorMessage: string | null;
  $: errorMessage = null;

  function backToPrevious() {
    personalDetailsComplete = false;
  }

  function next() {
    // reset error message
    errorMessage = null;

    // check valid age
    if (!checkValidAge()) {
      errorTitle = "Invalid date of birth";
      errorMessage = "You must be at least 18 years old to continue.";
      return;
    }

    personalDetailsComplete = true;
  }

  async function submitHandler() {
    // reset error message
    errorMessage = null;

    $loading = true;

    await AccountSystem.addMember(
      firstName,
      lastName,
      dob,
      phone,
      email,
      password
    )
      .then((result) => {
        $loading = false;
        goto("/signup/complete");
        notifyUser({
          label: "Your account has been created!",
          dismissButton: true,
        });
      })
      .catch((error) => {
        console.error(`Failed to create account: ${error}`);
        errorMessage = error;
        notifyUser({
          label: "Failed to create your account.",
          dismissButton: true,
        });
      });

    $loading = false;
  }

  import { fade } from "svelte/transition";
  const duration = 150;
</script>

{#if !personalDetailsComplete}
  <form
    on:submit|preventDefault={next}
    in:fade={{ duration: duration, delay: duration }}
    out:fade={{ duration: duration }}
  >
    <h2>Tell us about yourself</h2>
    <NameFields bind:firstName bind:lastName />

    <div class="input-group">
      <BirthdayField bind:dob bind:checkValidAge />
    </div>

    <div class="input-group">
      <PhoneField bind:phone />
    </div>
    <div class="submit-btn">
      <Button variant="raised">
        <Label>Next</Label>
      </Button>
    </div>
  </form>
{:else}
  <form
    on:submit|preventDefault={submitHandler}
    in:fade={{ duration: duration, delay: duration }}
    out:fade={{ duration: duration }}
  >
    <div class="container">
      <h2>Secure your account</h2>
      <div class="input-group">
        <EmailField bind:email />
      </div>

      <div class="input-group">
        <PasswordField bind:password newPassword />
      </div>

      <ErrorMessage display={errorMessage} label={errorTitle}
        >{errorMessage}</ErrorMessage
      >

      <div class="submit-group">
        <Button on:click={backToPrevious} color="secondary" variant="raised">
          <Label style="font-weight: 500;">Back</Label>
        </Button>
        <Button variant="raised">
          <Label>Create account</Label>
        </Button>
      </div>
    </div>
  </form>
{/if}

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 450px;
  }

  h2 {
    margin-bottom: 2rem;
    font-family: var(--font-family-secondary);
    font-size: 1rem;
    text-transform: unset;
  }

  .submit-group {
    display: flex;
    justify-content: space-evenly;
    column-gap: 2rem;
  }
</style>
