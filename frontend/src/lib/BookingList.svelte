<script lang="ts">
  import Button, { Label } from "@smui/button";
  import { quantify } from "./util/stringHelper";
  import Icon from "@smui/textfield/icon";
  import Member from "./controllers/Member";
  import { session } from "$app/stores";
  import loading from "../store/loading";
  import { flip } from "svelte/animate";
  import { getContext } from "svelte";
  import InlineNotification from "$lib/InlineNotification.svelte";
  const { notifyUser } = getContext("notify");

  export let bookings: Booking[] = [];
  let disabled = false;
  const submitHandler = (id: number) => {
    if (!$session.accessToken) {
      return;
    }

    $loading = true;

    Member.deleteBooking(id, $session.accessToken)
      .then(() => {
        // removes the booking from the array
        bookings = bookings.filter((booking) => {
          if (booking.id !== id) {
            return booking;
          }
        });

        notifyUser({
          label: "Your booking has been deleted.",
          dismissButton: true,
          requireInteraction: true,
        });

        disabled = true;

        $loading = false;
      })
      .catch((error) => {
        $loading = false;
      });
  };
</script>

{#if bookings.length}
  <ul>
    {#each bookings as { id, date, timeslot, guests }, i (id)}
      {@const dateObject = new Date(date)}
      {@const upcoming = dateObject.getTime() > Date.now()}
      <li animate:flip={{ duration: 200 }}>
        <div class="booking-details">
          <h2>
            <Icon class="material-icons">event</Icon>{dateObject.toDateString()}
          </h2>
          <span>
            <Icon class="material-icons">schedule</Icon>
            {timeslot}
          </span>
          <span>
            <Icon class="material-icons">people</Icon>
            {quantify(guests, "guest")}
          </span>
        </div>
        <!-- only allow canceling upcoming bookings -->
        {#if upcoming}
          <div class="cancel-booking-btn">
            <Button
              style="color: var(--error-color);"
              on:click={() => {
                submitHandler(id);
              }}
              title="Cancel booking #{id}"
            >
              <Label>Cancel booking</Label>
            </Button>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
{:else}
  <div class="empty">
    <img
      src="/images/noBookings.svg"
      height="500"
      width="500"
      alt="Woman looking at blank canvas"
    />
    <h2>We can't find any current bookings for you</h2>

    <Button
      href="/restaurant/booking"
      variant="raised"
      title="Go to Booking page"
    >
      <Label>Make a Booking</Label>
    </Button>
  </div>
{/if}

<style lang="scss">
  ul {
    display: grid;
    column-gap: 1rem;

    li,
    h2 {
      text-align: left;
    }

    li {
      display: grid;
      grid-template-columns: 70% 30%;
      padding-bottom: 2rem;

      &:not(:first-of-type) {
        border-top: 2px solid $secondary-color;
        padding-top: 2rem;
      }

      @include for-tablet-up {
        --padding: 2rem;
        padding-left: var(--padding);
        padding-right: var(--padding);
      }

      .cancel-booking-btn {
        margin-top: 2rem;
      }
    }

    h2 {
      font-size: 2rem;
    }

    // aligns material icons and text
    h2,
    span {
      display: flex;
      margin-bottom: 0.5rem;
    }
  }

  * :global(.material-icons) {
    padding: 0;
    margin-right: 1rem;
  }

  .empty {
    display: block;
    text-align: center;
  }
</style>
