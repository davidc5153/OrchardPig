<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  import { AVAILABILITY_URL, UTCtoPerth } from "$lib/controllers/Restaurant";
  import { BASE_URL } from "$lib/util/api";

  let currentDate: Date;

  export async function load({
    session,
    fetch,
  }: LoadInput): Promise<LoadOutput> {
    // convert current date to Perth timezone
    currentDate = UTCtoPerth(new Date());

    // set default booking values if user has not chosen any before
    if (!session.booking) {
      session.booking = {
        guests: 1,
        date: currentDate,
      };
    }

    let date = session.booking.date;

    // fetch available times
    const URL = `${BASE_URL}${AVAILABILITY_URL}?guests=${
      session.booking.guests
    }&date=${date.toJSON()}`;
    const res = await fetch(URL);

    if (res.ok) {
      const data = await res.json();
      const { lunchTimes, dinnerTimes } = sortSlots(data[date.toJSON()], date);

      return {
        props: {
          lunchTimes: lunchTimes,
          dinnerTimes: dinnerTimes,
        },
      };
    }

    return {
      props: {},
    };
  }

  // checks if a date matches the current date
  const isToday = (date: Date) => {
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  // sorts the availabe slots into lunch and dinner sessions
  // Alternative: Delegate timeslot sorting to backend endpoint.
  function sortSlots(availableSlots, date) {
    let lunchTimes: string[] = [];
    let dinnerTimes: string[] = [];

    availableSlots.forEach((slot) => {
      // Same day. Filter out booking based on the current time
      if (isToday(date) && slot.timeId <= currentDate.getHours()) {
        return;
      }

      if (slot.session === "LUNCH") {
        if (lunchTimes.includes(slot.time)) return;
        lunchTimes = [...lunchTimes, slot.time];
      } else {
        if (dinnerTimes.includes(slot.time)) return;
        dinnerTimes = [...dinnerTimes, slot.time];
      }
    });

    return { lunchTimes, dinnerTimes };
  }
</script>

<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Restaurant from "$lib/controllers/Restaurant";
  import { Datefield } from "svelte-mui";
  import Icon from "@smui/textfield/icon";
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";

  import { currentPageTitle } from "../../../store/index";
  import TimeSlots from "./_TimeSlots.svelte";
  $currentPageTitle = "Find a table";

  export let lunchTimes: string[] = [];
  export let dinnerTimes: string[] = [];

  let numGuests = $session.booking?.guests ?? 1;
  let date = $session.booking?.date ?? currentDate;

  const DATE_FORMAT = "DD/MM/YYYY";
  let message = DATE_FORMAT;

  let loading: boolean | null = null;

  // disables dates when returning false
  // MUI doesn't seem to actually disable selecting, only hover visuals - Tim.
  const isAllowed = (date: Date) => {
    return date >= currentDate;
  };

  // retrieves the available times given the date and guests
  const getAvailableTimes = async () => {
    loading = true;

    console.log(`Finding timeslots for ${numGuests} guests on ${date}`);

    await Restaurant.checkAvailability(numGuests, date)
      .then((availableSlots) => {
        // sort available slots into lunch and dinner
        const sessions = sortSlots(availableSlots, date);
        lunchTimes = sessions.lunchTimes;
        dinnerTimes = sessions.dinnerTimes;
      })
      .catch((error) => {
        lunchTimes = [];
        dinnerTimes = [];
      });

    loading = false;
  };

  let selectedTime: string | null = null;
  $: if (selectedTime) {
    submitHandler(selectedTime);
  }

  const submitHandler = (timeSlot: string) => {
    const booking = {
      guests: numGuests,
      date,
      timeSlot,
    };

    $session.booking = booking;
    goto("/restaurant/booking/details");
  };
</script>

<svelte:head>
  <title>Find a table – Orchard Pig</title>
</svelte:head>

<div class="search-options">
  <!-- Guests -->
  <div class="input-group">
    <Textfield
      bind:value={numGuests}
      type="number"
      input$min="1"
      input$max="12"
      label="Guests"
      on:change={getAvailableTimes}
    >
      <Icon class="material-icons" slot="leadingIcon">people</Icon>
      <HelperText validationMsg slot="helper" persistent>
        Max 12 per table
      </HelperText>
    </Textfield>
  </div>

  <!-- Date -->
  <div class="input-group">
    <Datefield
      bind:value={date}
      readonly={false}
      label="Date"
      format={DATE_FORMAT}
      bind:message
      locale="en-AU"
      {isAllowed}
      on:date-change={() => {
        if (isToday(date)) {
          // set to current time because
          // MUI date picker always returns dates set to 12 am.
          date = new Date();
        }

        getAvailableTimes();
      }}
      --primary="#8F4305"
      style="width: 50px"
    />
  </div>
</div>

<!-- Returned times -->
<section>
  <!-- Lunch -->
  <TimeSlots
    bind:loading
    bind:timeSlots={lunchTimes}
    label="Lunch"
    bind:selectedTime
  />

  <TimeSlots
    bind:loading
    bind:timeSlots={dinnerTimes}
    label="Dinner"
    bind:selectedTime
  />
</section>

<style lang="scss">
  // sets font used for svelte-mui datepicker
  * :global(div) {
    font-family: var(--font-family-secondary);
  }

  .search-options {
    display: flex;
    flex-wrap: wrap;
    column-gap: 2rem;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
    max-width: 800px;
  }

  .input-group {
    width: 150px;
  }

  section {
    padding-left: 1rem;
    padding-right: 1rem;
  }
</style>
