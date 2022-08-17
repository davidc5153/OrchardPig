<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";

  export async function load({ session }: LoadInput): Promise<LoadOutput> {
    if (!session.booking?.timeSlot) {
      return {
        redirect: "/restaurant/booking",
        status: 302,
      };
    }

    if (!session.booking?.guests || !session.booking?.date) {
      return {
        redirect: "/restaurant/booking",
        status: 302,
      };
    }

    return {
      props: {
        booking: session.booking,
      },
    };
  }
</script>

<script lang="ts">
  import Button, { Label } from "@smui/button";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import { goto, prefetch } from "$app/navigation";
  import { session } from "$app/stores";
  import SignInForm from "$lib/forms/SignInForm.svelte";
  import { quantify } from "$lib/util/stringHelper";
  import UserDetails from "$lib/forms/UserDetails.svelte";

  import { currentPageTitle } from "../../../store/index";
  $currentPageTitle = "Your details";

  export let booking: BookingProcess;

  let notes = "";

  async function submitHandler() {
    if ($session.booking) {
      $session.booking.notes = notes;
    }

    goto("/restaurant/booking/review");
  }
</script>

<svelte:head>
  <title>Enter your contact details – Orchard Pig</title>
</svelte:head>

<h1>
  {quantify(booking.guests, "guest")} on {booking.date.toDateString()} at {booking.timeSlot}
</h1>

{#if !$session.accessToken}
  <section>
    <h2 style="color: black">Sign in to continue booking</h2>
    <SignInForm ref="/restaurant/booking/details" />
    <!-- Back Button -->
    <div class="back-btn">
      <Button
        on:mouseover={() => prefetch("/restaurant/booking")}
        href="/restaurant/booking"
        color="secondary"
        variant="raised"
        title="Back to selecting date and time"
        ><Label>Back</Label>
      </Button>
    </div>
  </section>
{:else}
  <section>
    <UserDetails />
  </section>

  <section>
    <form on:submit|preventDefault>
      <h2>Do you need anything else?</h2>
      <Textfield
        style="height: 200px;"
        textarea
        variant="filled"
        bind:value={notes}
        label="Special Requirements"
      >
        <HelperText validationMsg slot="helper">
          Please let us know if you have any special requirements.
        </HelperText>
      </Textfield>
    </form>

    <div class="btns">
      <!-- Back Button -->
      <div class="back-btn">
        <Button
          on:mouseover={() => prefetch("/restaurant/booking")}
          href="/restaurant/booking"
          color="secondary"
          variant="raised"
          title="Back to selecting date and time"
          ><Label>Back</Label>
        </Button>
      </div>

      <!-- Next Button -->
      <div class="submit-btn">
        <Button
          on:click={submitHandler}
          variant="raised"
          title="Review booking details"
        >
          <Label>Review booking</Label>
        </Button>
      </div>
    </div>
  </section>
{/if}

<style lang="scss">
  h1 {
    font-size: 2.5rem;
    color: var(--secondary-color);
    text-transform: unset;
  }

  h2 {
    color: #000;
    font-size: 3rem;
  }

  section {
    margin-bottom: 2rem;
    padding: 1rem;
    text-align: center;
  }

  form,
  .btns {
    @include center-margins;
    max-width: 500px;
  }

  .btns {
    display: flex;
    justify-content: space-between;
    @include for-tablet-up {
      justify-content: space-around;
    }
  }
</style>
