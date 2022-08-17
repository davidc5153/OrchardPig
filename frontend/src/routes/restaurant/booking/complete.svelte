<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";

  export async function load({}: LoadInput): Promise<LoadOutput> {
    let bookingDetails: any;

    confirmedBooking.subscribe((value) => (bookingDetails = value));

    if (!bookingDetails) {
      return {
        status: 302,
        redirect: "/",
      };
    }

    bookingDetails.date = new Date(bookingDetails.date);

    return {
      props: {
        booking: bookingDetails,
      },
    };
  }
</script>

<script lang="ts">
  import { quantify } from "$lib/util/stringHelper";
  import confirmedBooking from "../../../store/confirmedBooking";
  import Button, { Label } from "@smui/button";
  import { currentPageTitle } from "../../../store/index";
  import { prefetch } from "$app/navigation";
  $currentPageTitle = "Booking complete!";

  export let booking: any;

  // remove stored details for a confirmed booking.
  confirmedBooking.set(null);
</script>

<section>
  <h1>You're all booked in!</h1>
  <h2>
    {quantify(booking.guests, "guest")} on {booking.date.toDateString()} at {booking.timeslot}
  </h2>
  <span>{booking.firstName} {booking.lastName}</span>
  <span>{booking.phone}</span>
  <img
    src="/images/bookingConfirmed.svg"
    height="168"
    width="300"
    alt="Woman looking at blank canvas"
  />

  <div class="btns">
    <div class="home-btn">
      <Button href="/" color="secondary" variant="raised" title="Go to Home"
        ><Label>Home</Label>
      </Button>
    </div>
    <div class="bookings-btn">
      <Button
        on:mouseover={() => prefetch("/customer/bookings")}
        href="/customer/bookings"
        variant="raised"
        title="Go to customer bookings"
        ><Label>Go to bookings</Label>
      </Button>
    </div>
  </div>
</section>

<style lang="scss">
  section {
    margin-top: 1.5rem;
    margin-bottom: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: center;
    .btns {
      display: flex;
      justify-content: space-around;
      .home-btn,
      .bookings-btn {
        margin: 1rem;
      }
    }
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2.5rem;
    color: var(--secondary-color);
  }

  span {
    display: block;
  }

  img {
    margin-top: 2rem;
    height: auto;
    max-width: 300px;
    margin-bottom: 2rem;
  }
</style>
