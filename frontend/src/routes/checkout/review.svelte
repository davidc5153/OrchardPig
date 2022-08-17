<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  export async function load({ session }: LoadInput): Promise<LoadOutput> {
    if (session.accessToken && session.cart.length < 1) {
      return {
        status: 302,
        redirect: `/cart`,
      };
    }

    // check if member has an address
    if (session.accessToken && !session.delivery) {
      return {
        status: 302,
        redirect: "/checkout/delivery",
      };
    }

    return {
      props: {},
    };
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";
  import Member from "$lib/controllers/Member";
  import ShoppingCart from "$lib/ShoppingCart.svelte";
  import Button, { Label } from "@smui/button";
  import loading from "../../store/loading";
  import Guest from "$lib/controllers/guest/Guest";
  import { getContext } from "svelte";
  const { notifyUser } = getContext("notify");

  let user = $session.user;
  let delivery = $session.delivery;

  async function submitHandler() {
    $loading = true;
    if ($session.accessToken) {
      await Member.checkout($session.accessToken)
        .then((result) => {
          goto("/checkout/complete");
        })
        .catch((error) => {});
    } else {
      await Guest.checkout(
        user.firstName,
        user.lastName,
        user.dob,
        user.phone,
        user.email,
        delivery.address,
        delivery.city,
        delivery.state,
        delivery.postcode,
        $session.cart
      )
        .then((result) => {
          goto("/checkout/complete");
        })
        .catch((error) => {
          console.error(error.response.data.message);
          notifyUser({
            label: error.response.data.message,
            actions: [{
              onClick: () => goto("/checkout"),
              text: "Log in",
            }],
            dismissButton: true,
          });
        });
    }
    $loading = false;
  }
</script>

<svelte:head>
  <title>Review Your Order – Orchard Pig</title>
</svelte:head>

<section>
  <h1>Review your order</h1>
  <div class="delivery-details">
    <p>{user.firstName} {user.lastName}</p>
    <p>
      {delivery.address}<br />
      {delivery.city}
      {delivery.state}
      {delivery.postcode}
    </p>
  </div>
  <ShoppingCart />
  <div class="buttons">
    <Button
      color="secondary"
      href="/checkout/payment"
      variant="raised"
      title="Back to Payment"
    >
      <Label>Back</Label>
    </Button>
    <Button
      on:click={submitHandler}
      variant="raised"
      title="Confirm your order"
    >
      <Label>Confirm order</Label>
    </Button>
  </div>
</section>

<style lang="scss">
  section {
    @include section-width;
    @include center-margins;
  }

  .delivery-details {
    margin: 0.5rem;
  }
  .buttons {
    display: flex;
    justify-content: space-around;
    margin: 2rem 0;
  }
</style>
