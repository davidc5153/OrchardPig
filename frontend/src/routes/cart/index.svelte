<script lang="ts">
  import { currentPageTitle } from "../../store/index";
  $currentPageTitle = "Shopping Cart";
  import ShoppingCart from "$lib/ShoppingCart.svelte";
</script>

<svelte:head>
  <title>Shopping Cart – Orchard Pig</title>
  <link
    rel="preconnect"
    href="https://orchardpigproducts.s3.ap-southeast-2.amazonaws.com"
  />
</svelte:head>

<ShoppingCart enableEditing />

<section id="help">
  <div class="container">
    <p>Website sales are only available within Australia.</p>
    <h2>Need a hand?</h2>
    <p>
      Call us on <a href="tel:+61897572399">(08) 9757 2399</a> or email us at
      <a href="mailto:customerservice@orchardpig.com.au"
        >customerservice@orchardpig.com.au</a
      >
    </p>
  </div>
</section>

<style lang="scss">
  section {
    margin-bottom: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: center;
    max-width: unset;

    .container {
      @include center-margins;
      max-width: 800px;
    }
  }

  #help {
    h2,
    p {
      @include for-tablet-up {
        margin-left: 0;
        margin-right: 0;
        text-align: left;
      }
    }

    h2 {
      margin-bottom: 1rem;
      font-size: 3rem;
      color: var(--secondary-color);
    }

    p {
      margin-bottom: 2rem;
      max-width: 400px;
    }
  }
</style>
