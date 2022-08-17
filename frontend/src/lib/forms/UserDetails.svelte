<script lang="ts">
  import ErrorMessage from "$lib/InlineNotification.svelte";
  import { getContext } from "svelte";
  import AccountSystem from "$lib/controllers/AccountSystem";
  import BirthdayField from "./BirthdayField.svelte";
  import NameFields from "./NameFields.svelte";
  import PhoneField from "./PhoneField.svelte";
  import Icon from "@smui/textfield/icon";
  import { session } from "$app/stores";
  import Editable from "./Editable.svelte";
  import loading from "../../store/loading";
  const { notifyUser } = getContext("notify");
  import { goto } from "$app/navigation";
  import Guest from "$lib/controllers/guest/Guest";
  import EmailField from "./EmailField.svelte";

  let user = $session.user;

  let firstName = user.firstName;
  let lastName = user.lastName;
  let email = user.email;
  let formattedDate = user.dob.split("T")[0];
  $: dob = formattedDate;
  let phone = user.phone;

  let checkValidAge: () => boolean;
  export let editing = false;

  let errorTitle = "Error";
  let errorMessage: string | null;
  $: errorMessage = null;

  function closeEditing() {
    errorMessage = null;
    editing = false;
  }

  async function saveChanges() {
    // reset error message
    errorMessage = null;

    // check valid age
    if (!checkValidAge()) {
      errorTitle = "Invalid date of birth";
      errorMessage = "You must be at least 18 years old to continue.";
      return;
    }

    $loading = true;

    if ($session.accessToken) {
      await AccountSystem.updateMember(
        user,
        firstName,
        lastName,
        dob,
        phone,
        email,
        $session.accessToken
      )
        .then((result) => {
          setChanges()
          notifyUser({
            label: "Your account has been updated!",
            dismissButton: true,
          });
        })
        .catch((error) => {
          console.error(`Failed to update account: ${error}`);
          errorMessage = error;
          notifyUser({
            label: "Failed to update your account. " + errorMessage,
            dismissButton: true,
          });
        });
      $loading = false;
      return;
    }

    await Guest.setUser(firstName, lastName, dob, phone, email)
      .then((result) => {
        setChanges()
        notifyUser({
          label: "Your account has been updated!",
          dismissButton: true,
        });
      })
      .catch((error) => {
        console.error(`Failed to update account: ${error}`);
        errorMessage = error;
        notifyUser({
          label: "Failed to update your account." + errorMessage,
          dismissButton: true,
        });
      });
    $loading = false;
  }

  function discardChanges() {
    firstName = user.firstName;
    lastName = user.lastName;
    dob = formattedDate;
    phone = user.phone;
    email = user.email;
  }

  function setChanges() {
    user.firstName = firstName;
    user.lastName = lastName;
    user.dob = formattedDate;
    user.phone = phone;
    user.email = email;
  }

</script>

<Editable type="user" {saveChanges} {discardChanges} bind:editing>
  <div class="form-fields" slot="formFields">
    <h2>Editing user details</h2>
    <NameFields bind:firstName bind:lastName />

    <div class="input-group">
      <BirthdayField bind:dob bind:checkValidAge />
    </div>

    <div class="input-group">
      <EmailField bind:email />
    </div>

    <div class="input-group">
      <PhoneField bind:phone />
    </div>
  </div>
  <div class="user-details" slot="details">
    <h2>Your details</h2>
    <span>
      <Icon class="material-icons">person</Icon>
      {firstName}
      {lastName}
    </span>
    <span>
      <Icon class="material-icons">mail</Icon>
      {email}
    </span>
    <span>
      <Icon class="material-icons">phone</Icon>
      {phone}
    </span>
  </div>
</Editable>

<style lang="scss">
  .form-fields {
    h2 {
      margin-bottom: 2rem;
    }
  }

  h2 {
    margin-bottom: 1rem;
    text-align: left;
    font-size: 1.5rem;
    font-weight: 600;
    font-family: var(--font-family-secondary);
  }

  .user-details {
    span {
      display: flex;
      align-items: center;
      width: 100%;
      font-size: 12px;
      @include for-tablet-up {
        font-size: 18px;
      }
    }
  }

  * :global(.material-icons) {
    padding: 0;
    margin-right: 1rem;
  }
</style>
