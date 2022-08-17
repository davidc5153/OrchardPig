<script lang="ts">
  import Button, { Label } from "@smui/button";
  import { goto } from "$app/navigation";
  import Auth from "$lib/controllers/Auth";
  import EmailField from "./EmailField.svelte";
  import loading from "../../store/loading";
  import { getContext } from "svelte";
  const { notifyUser } = getContext("notify");
  import ErrorMessage from "$lib/InlineNotification.svelte";
  import { session } from "$app/stores";
  import PasswordField from "./PasswordField.svelte";

  // page to redirect to after signing in
  export let ref = "/customer/bookings";

  // set default ref url if the param is null / empty
  if (!ref) {
    ref = "/customer/bookings";
  }

  let email = "";
  let password = "";
  let openId: Record<string, string> | null = null;
  let disableSubmitButton = false;
  let errorMessage: string | null = null;

  async function submitHandler() {
    errorMessage = null;

    $loading = true;

    Auth.signin(email, password, openId)
      .then(() => {
        $loading = false;

        notifyUser({
          label: `Welcome, ${$session.user.firstName}`,
          dismissButton: true,
        });
        goto(ref);
      })
      .catch((error) => {
        notifyUser({
          label: "Failed to sign in",
          dismissButton: true,
        });
        errorMessage = error;
        $loading = false;
      });
  }
</script>

<form on:submit|preventDefault={submitHandler}>
  <div class="input-group">
    <EmailField bind:email />
  </div>

  <div class="input-group">
    <PasswordField bind:password />
  </div>

  <ErrorMessage display={errorMessage} label="Failed to sign in"
    >{errorMessage}</ErrorMessage
  >

  <Button variant="raised" disabled={disableSubmitButton}>
    <Label>Sign In</Label>
  </Button>
  <a href="/signup" title="Link to create account page">Create new account</a>
</form>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
  }

  a {
    margin-top: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 600;
    text-transform: capitalize;

    &::after {
      content: " >";
    }
  }

  :global(#googleSigninButton) {
    margin-top: 2rem;
    background-color: #4285f4;
  }
</style>
