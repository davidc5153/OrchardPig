<script context="module" type="ts">
  import { BASE_URL } from "$lib/util/api";
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";

  export async function load({
    fetch,
    session,
  }: LoadInput): Promise<LoadOutput> {
    if (session.accessToken && session.cart.length < 1) {
      return {
        status: 302,
        redirect: `/cart`,
      };
    }

    // check if member address is loaded
    if (session.accessToken && !session.delivery) {
      let URL = `${BASE_URL}/user/address`;

      let deliveryRes = await fetch(URL, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (deliveryRes.ok) {
        let delivery = await deliveryRes.json();

        if (!delivery) {
          return {
            status: deliveryRes.status,
            error: new Error(`Could not load ${URL}`),
          };
        }

        console.log(`GET > /user/address : ${delivery.address}`);
        session.delivery = delivery;
      }
    }

    return {
      props: {},
    };
  }
</script>

<script lang="ts">
  import Button, { Label } from "@smui/button";
  import AddressFields from "$lib/forms/AddressFields.svelte";
  import Userfields from "$lib/forms/UserFields.svelte";
  import { session } from "$app/stores";
  import { goto } from "$app/navigation";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import Guest from "$lib/controllers/guest/Guest";
  import { browser } from "$app/env";

  let addressForm: HTMLFormElement;
  let userForm: HTMLFormElement;

  let address: string;
  let city: string;
  let state: string;
  let postcode: string;
  let saveAddress: () => Promise<void>;

  let firstName: string;
  let lastName: string;
  let dob: string;
  let phone: string;
  let email: string;

  let checked = false;
  const nextStep = "/checkout/payment";

  // save user details to session
  async function sessionUser() {
    const user = {
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      phone: phone,
      email: email,
    };

    $session.user = user;

    return user;
  }

  // save delivery address details to session
  async function sessionAddress() {
    $session.delivery = {
      address: address,
      city: city,
      state: state,
      postcode: postcode,
    };
  }

  let checkValidAge: () => boolean;

  async function submitHandler() {
    // skip form validation if required details are present
    if ($session.delivery && $session.user) {
      goto(nextStep);
      return;
    }

    // validate address form if it exists
    if (!$session.delivery && !addressForm.reportValidity()) {
      return;
    }

    // validate user form if it exists
    if (!$session.user && !userForm.reportValidity()) {
      return;
    }

    // validates age after standard form validation separately because
    // they conflict with each other and break validation.
    if (!$session.user && !checkValidAge()) {
      return;
    }

    $loading = true;

    // check if Guest wants details to be remembered
    if (!$session.accessToken) {
      // save all details to session only
      if (!$session.delivery && !checked) {
        await Promise.all([sessionUser(), sessionAddress()])
          .then(() => {
            goto(nextStep);
          })
          .catch((error) => {
            console.error(error);
          });
      }
      // save to all details to local storage
      else if (checked) {
        await Guest.setUser(firstName, lastName, dob, phone, email);
      }
    }

    // save delivery address if none found in memory
    if (!$session.delivery) {
      await saveAddress()
        .then((result) => {
          goto(nextStep);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      goto(nextStep);
    }

    $loading = false;
  }

  import loading from "../../store/loading";
  import UserDetails from "$lib/forms/UserDetails.svelte";
  import UserAddress from "$lib/forms/UserAddress.svelte";
  import EmailField from "$lib/forms/EmailField.svelte";

  async function loadGuestData() {
    // load locally stored guest user / address data
    if (browser && !$session.accessToken) {
      $loading = true;

      await Promise.all([Guest.getAddress(), Guest.getUser()])
        .then((values) => {})
        .catch((error) => {
          console.error("failed to load Guest data from local storage");
        });

      $loading = false;
    }
  }

  loadGuestData();

  let editingUser = false;
  let editingAddress = false;

  // checks if details exist once when page loads
  let userDetailsExist = $session.user ? true : false;
  let addressDetailsExist = $session.delivery ? true : false;
</script>

<svelte:head>
  <title>Delivery Details – Orchard Pig</title>
</svelte:head>

<section>
  {#if !editingUser}
    <!-- Display user's address if it already exists -->
    {#if addressDetailsExist}
      <div class="details">
        <UserAddress bind:editing={editingAddress} />
      </div>
    {:else}
      <form on:submit|preventDefault={submitHandler} bind:this={addressForm}>
        <h2>Where should we send your order?</h2>
        <AddressFields
          bind:saveAddress
          bind:address
          bind:city
          bind:state
          bind:postcode
        />
      </form>
    {/if}
  {/if}

  <!-- Display user's contact details if it already exists -->
  {#if !editingAddress}
    {#if userDetailsExist}
      <div class="details">
        <UserDetails bind:editing={editingUser} />
      </div>
    {:else}
      <!-- Display form fields for contact details -->
      <form on:submit|preventDefault={submitHandler} bind:this={userForm}>
        <h2>How should we contact you?</h2>
        <Userfields
          bind:firstName
          bind:lastName
          bind:dob
          bind:phone
          bind:checkValidAge
        />
        <div class="input-group">
          <EmailField bind:email />
        </div>

        {#if !$session.accessToken}
          <FormField>
            <Checkbox bind:checked />
            <span slot="label">Remember me</span>
          </FormField>
        {/if}
      </form>
    {/if}
  {/if}

  {#if !editingUser && !editingAddress}
    <div class="btns">
      <div class="cancel-btn">
        <Button
          color="secondary"
          href="/cart"
          variant="raised"
          title="Back to cart"
        >
          <Label>Cancel</Label>
        </Button>
      </div>
      <div class="submit-btn">
        <Button
          on:click={submitHandler}
          variant="raised"
          title="Continue to payment"
        >
          <Label>Continue</Label>
        </Button>
      </div>
    </div>
  {/if}
</section>

<style lang="scss">
  section {
    padding: 1rem;
  }

  h2 {
    font-size: 3rem;
  }

  .details {
    margin-bottom: 3rem;
  }

  form {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1rem;
    width: 100%;
    max-width: 450px;
  }

  .btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    width: 100%;
  }
</style>
