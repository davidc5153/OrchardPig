<script context="module" lang="ts">
  export const prerender = true;
</script>

<script>
  import BookBtn from "$lib/buttons/BookBtn.svelte";
  import { currentPageTitle } from "../../store/index";
  $currentPageTitle = "Restaurant";
  import BookFAB from "$lib/buttons/BookFAB.svelte";
  import BackToTopBtn from "$lib/buttons/BackToTopBtn.svelte";
</script>

<svelte:head>
  <title>Restaurant – Orchard Pig</title>
</svelte:head>

<div class="hero-image" />

<section>
  <div class="restaurant-intro">
    <h1>Visit The Flying Pig</h1>
    <p>
      The Flying Pig is a Five-Star Gourmet restaurant nestled in the Margaret
      River Region, showcasing the amazing local produce and products of the
      South West. As well as delicious Lunch, Dinner and Function menus, The
      Flying Pig also offers a range of ciders to sample from our house brand,
      Orchard Pig.
    </p>
  </div>
</section>

<div class="dining-image" />

<section>
  <p>
    Bookings are essential on Friday nights and recommended all other times
    although we will seat as many walk-ins as possible during lunch services.
    All bookings are for 1 hour. Tables will be held for 10 minutes after
    booking time.
  </p>
  <div class="opening-hours">
    <h2>Opening Hours</h2>
    <p>Monday - Thursday 12pm - 10pm</p>
    <p>Friday - Sunday 11am - 11pm</p>
    <BookBtn />
  </div>
</section>

<style lang="scss">
  .hero-image {
    @include hero-image(url("/images/restaurant.jpg"));
    background-position: 50% 50%;
    height: 70vh;
    background-attachment: fixed;
  }

  .restaurant-intro {
    margin: 1rem;
    @include for-tablet-up {
      margin: 4rem;
    }
  }

  section {
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: center;
  }

  .dining-image {
    @include hero-image(url("/images/dining.jpg"));
    background-position: 50% 30%;
    height: 70vh;
    background-attachment: fixed;
  }

  .opening-hours {
    margin-top: 2rem;
    margin-bottom: 2rem;
    text-align: center;

    h2 {
      font-family: var(--font-family-secondary);
      font-size: 1.5rem;
      font-weight: 600;
    }

    p:last-of-type {
      margin-bottom: 2rem;
    }
  }

  @media only screen and (max-device-width: 601px) {
    .hero-image,
    .dining-image {
      height: 50vh;
      background-attachment: scroll;
    }
  }
</style>
