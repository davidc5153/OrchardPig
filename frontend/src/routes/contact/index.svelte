<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import ContactForm from "./_ContactForm.svelte";
  import { googleMapsApi } from "$lib/util/api";
  import { currentPageTitle } from "../../store/index";
  import BookFAB from "$lib/buttons/BookFAB.svelte";
  import BackToTopBtn from "$lib/buttons/BackToTopBtn.svelte";
  $currentPageTitle = "Contact";

  // adds the Google map instance to the document
  function initMap(node: HTMLDivElement, googleApi: any): void {
    const location = {
      lat: -33.95405143747906,
      lng: 115.06337908959708,
    };
    const mapOptions = {
      center: location,
      zoom: 15,
    };

    const map = new googleApi.maps.Map(node, mapOptions);

    new googleApi.maps.Marker({
      position: location,
      map: map,
      icon: "/images/op-logo-black-sml.png",
      animation: googleApi.maps.Animation.BOUNCE,
    });
  }
</script>

<svelte:head>
  <title>Contact – Orchard Pig</title>
</svelte:head>

<div class="hero-image" />

<header>
  <h1>Contact us</h1>
</header>

<address>
  <div class="contact-info">
    <h2>Cellar Door</h2>
    <section>
      <h3>Contact</h3>
      <span><a href="tel:0413629998">0413 629 998</a></span>
      <span
        ><a href="mailto:cellardoor@orchardpig.com.au"
          >cellardoor@orchardpig.com.au</a
        ></span
      >
    </section>

    <section>
      <h3>Opening Hours</h3>
      <p>10am-5pm EVERYDAY</p>
    </section>

    <section class="closed-dates">
      <h3>Closed</h3>
      <ul>
        <li>New Year's Day</li>
        <li>Good Friday</li>
        <li>ANZAC Day</li>
        <li>Christmas Day</li>
        <li>Boxing Day</li>
      </ul>
    </section>
  </div>

  <div class="contact-info">
    <h2>Restaurant</h2>
    <section>
      <h3>Contact</h3>
      <span><a href="tel:0427144200">0427 144 200</a></span>
      <span>
        <a href="mailto:restaurant@orchardpig.com.au"
          >restaurant@orchardpig.com.au</a
        >
      </span>
    </section>

    <section>
      <h3>Opening Hours</h3>
      <span>Monday - Thursday 12pm - 10pm</span>
      <span>Friday - Sunday 11am - 11pm</span>
    </section>

    <section class="closed-dates">
      <h3>Closed</h3>
      <ul>
        <li>New Year's Day</li>
        <li>Christmas Day</li>
        <li>Boxing Day</li>
      </ul>
    </section>
  </div>

  <div class="address-info">
    <h2>Address</h2>
    <p>
      156 College Ave<br />
      Margaret River WA 6285
    </p>
    {#await googleMapsApi.load()}
      <div id="map" />
    {:then api}
      <div id="map" use:initMap={api} />
    {:catch}
      <iframe
        id="map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52944.1157548356!2d115.01788204093297!3d-33.966653540974775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a2fad194eac6951%3A0x500f638247a0e10!2sMargaret%20River%20WA%206285%2C%20Australia!5e0!3m2!1sen!2smy!4v1642216116264!5m2!1sen!2smy"
        width="600"
        height="450"
        allowfullscreen
        loading="lazy"
        title="Margaret River, Australia in Google Maps"
      />
    {/await}
  </div>
</address>
<article class="contact-form">
  <h2>Get in touch</h2>
  <ContactForm />
</article>

<style lang="scss">
  .hero-image {
    @include hero-image(url("/images/contact.jpg"));
    background-position: 50% 10%;
    height: 70vh;
    background-attachment: fixed;
  }

  header {
    margin-top: 2rem;
  }

  address {
    text-align: center;
    width: 100%;

    @include for-tablet-up {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      column-gap: 10%;
    }

    h2 {
      margin-bottom: 1rem;
      font-size: 4rem;
      color: $secondary-color;
    }

    h3 {
      margin-bottom: 0.5rem;
      font-family: var(--font-family-secondary);
      font-size: 1.2rem;
      font-weight: 600;
      color: #000;
      letter-spacing: normal;
    }

    section {
      margin-bottom: 2rem;
    }
  }

  .contact-info {
    @include col;
    align-items: center;
    margin-top: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;

    & > * {
      padding-left: 0;
      padding-right: 0;
    }

    span {
      display: block;
      margin-bottom: 0.5rem;
    }

    a {
      color: #000;
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }
  }

  .address-info {
    margin-top: 2rem;
    margin-bottom: 2rem;

    @include for-tablet-up {
      flex-basis: 100%;
    }
  }

  #map {
    margin-top: 2rem;
    height: 500px;
    background: #ddd;
  }

  .contact-form {
    @include col;
    align-items: center;
    margin-top: 2rem;
    width: 100%;
    max-width: 600px;

    h2 {
      margin-bottom: 2rem;
    }
  }

  @media only screen and (max-device-width: 601px) {
    .hero-image {
      height: 50vh;
      background-attachment: scroll;
    }
  }
</style>
