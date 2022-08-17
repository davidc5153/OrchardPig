<script>
  import BackToHome from "$lib/buttons/HomeBtn.svelte";
  import { currentPageTitle } from "../../store/index";
  $currentPageTitle = "Order confirmed";
</script>

<svelte:head>
  <title>Your Order Is Confirmed! – Orchard Pig</title>
</svelte:head>

<section>
  <h1>Your order is confirmed!</h1>
  <p>Please wait for up to 24 hours for us to process your order.</p>

  <img
    src="/images/order_received.svg"
    width="300"
    height="250"
    alt="Order is on its way"
  />
</section>

<section>
  <div class="btn">
    <BackToHome />
  </div>
</section>

<style lang="scss">
  section {
    @include section-width;
    @include center-margins;
    text-align: center;

    h1 {
      margin-top: 4rem;
    }
    .btn {
      margin: 2rem 0;
    }
  }
</style>
