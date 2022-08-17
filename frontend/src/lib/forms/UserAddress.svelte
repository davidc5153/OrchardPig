<script lang="ts">
  import ErrorMessage from "$lib/InlineNotification.svelte";
  import { getContext } from "svelte";
  import { session } from "$app/stores";
  const { notifyUser } = getContext("notify");
  import AddressFields from "./AddressFields.svelte";
  import Editable from "./Editable.svelte";
  import { loading } from "../../store/loading";

  let delivery = $session.delivery;

  let address = delivery?.address;
  let city = delivery?.city;
  let state = delivery?.state;
  let postcode = delivery?.postcode;

  let saveAddress: () => Promise<void>;

  export let editing = false;

  let errorTitle = "Error";
  let errorMessage: string | null;
  $: errorMessage = null;

  async function saveChanges() {
    // reset error message
    errorMessage = null;

    $loading = true;

    await saveAddress()
      .then((result) => {
        notifyUser({
          label: "Your address has been updated!",
          dismissButton: true,
        });
      })
      .catch((error) => {
        notifyUser({
          label: "Failed to update your address.",
          dismissButton: true,
        });
      });

    $loading = false;
  }

  function discardChanges() {
    address = delivery?.address;
    city = delivery?.city;
    state = delivery?.state;
    postcode = delivery?.postcode;
  }
</script>

<Editable
  type="address"
  saveChanges={saveChanges}
  {discardChanges}
  bind:editing
>
  <div class="form-fields" slot="formFields">
    <h2>Editing address</h2>
    <AddressFields
      bind:address
      bind:city
      bind:state
      bind:postcode
      bind:saveAddress
    />
  </div>
  <div class="address-details" slot="details">
    <h2>Your address</h2>
    <span>
      {$session.delivery?.address}<br />
      {$session.delivery?.city}
      {$session.delivery?.state}
      {$session.delivery?.postcode}
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

  .address-details {
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
</style>
