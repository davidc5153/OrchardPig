<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  import Member from "$lib/controllers/Member";

  export async function load({ session }: LoadInput): Promise<LoadOutput> {
    if (!session.booking) {
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
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";
  import Button, { Label } from "@smui/button";
  import loading from "../../../store/loading";
  import { currentPageTitle } from "../../../store/index";
  import { quantify } from "$lib/util/stringHelper";
  $currentPageTitle = "Review";

  export let booking: BookingProcess;

  async function submitHandler() {
    $loading = true;

    await Member.book(
      booking.guests,
      booking.date,
      booking.timeSlot,
      booking.notes,
      $session.accessToken
    )
      .then((result) => {
        goto("/restaurant/booking/complete");
      })
      .catch((error) => {});

    $loading = false;
  }
</script>

<section>
  <h2>Are these details correct?</h2>

  <h3>
    {quantify(booking.guests, "guest")} on {booking.date.toDateString()} at {booking.timeSlot}
  </h3>

  {#if booking.notes}
    <h3>Special requirements</h3>
    <p>{booking.notes}</p>
  {/if}

  <div class="btns">
    <Button
      variant="raised"
      href="/restaurant/booking/details"
      style="margin: 2rem 1rem"
      color="secondary"
      title=""
    >
      <Label>Back</Label>
    </Button>

    <Button
      on:click={submitHandler}
      variant="raised"
      style="margin: 2rem 1rem"
      title=""
    >
      <Label>Confirm booking</Label>
    </Button>
  </div>
</section>

<style lang="scss">
  section {
    text-align: center;
    margin: 2rem 0;
  }
  .btns {
    display: flex;
    justify-content: space-between;
    @include for-tablet-up {
      justify-content: space-around;
    }
  }
</style>
