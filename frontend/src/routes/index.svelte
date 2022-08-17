<script context="module">
  export const prerender = true;
</script>

<script>
  import { currentPageTitle } from "../store/index";
  import BookBtn from "$lib/buttons/BookBtn.svelte";
  import ShopBtn from "$lib/buttons/ShopBtn.svelte";
  import BookFAB from "$lib/buttons/BookFAB.svelte";
  import BackToTopBtn from "$lib/buttons/BackToTopBtn.svelte";
  $currentPageTitle = "Orchard Pig";
</script>

<svelte:head>
  <title>Orchard Pig</title>
</svelte:head>

<div class="hero-image" />

<header>
  <h1>Cider to Snout About</h1>
  <p>
    Browse our range of authentic, great tasting ciders to snout about! Warning-
    may contain traces of mischief and good times!
  </p>
</header>

<section>
  <h2>Shop our ciders</h2>
  <ul class="cider-list">
    <li class="list-item">
      <a
        sveltekit:prefetch
        href="/products/14"
        title="Link to Truffler product page"
        ><img
          src="/images/truffler.png"
          width="300"
          height="204"
          alt="A bottle of Orchard Pig's Truffler cider"
          loading="lazy"
        /></a
      >
      <h3>Truffler</h3>
      <p>
        A welcome hint of sweetness gives a long, rounded finish without
        compromising the dry character.
      </p>
    </li>
    <li class="list-item">
      <a
        sveltekit:prefetch
        href="/products/12"
        title="Link to Reveller product page"
        ><img
          src="/images/reveller.png"
          width="300"
          height="204"
          alt="A bottle of Orchard Pig's Reveller cider"
          loading="lazy"
        /></a
      >
      <h3>Reveller</h3>
      <p>
        A generous apple aroma with a tangy note of freshly squeezed lime in the
        finish.
      </p>
    </li>
    <li class="list-item">
      <a
        sveltekit:prefetch
        href="/products/13"
        title="Link to Hogfather product page"
        ><img
          src="/images/hogfather.png"
          width="300"
          height="204"
          alt="A bottle of Orchard Pig's Hogfather cider"
          loading="lazy"
        /></a
      >
      <h3>Hogfather</h3>
      <p>
        Hogfather is not for the faint hearted, so close your eyes and savour
        the West Country apples in this one.
      </p>
    </li>
  </ul>
  <div class="shop-btn">
    <ShopBtn label="Shop now" />
  </div>
</section>

<section>
  <h2>Fine dining</h2>
  <p>
    The Flying Pig is a Five-Star Gourmet restaurant nestled in the Margaret
    River Region, showcasing the amazing local produce and products of the South
    West. As well as delicious Lunch, Dinner and Function menus, The Flying Pig
    also offers a range of ciders to sample from our house brand, Orchard Pig.
  </p>
  <div class="restaurant-image" />
  <p>
    To secure your spot for feeding time, please make a reservation through our
    booking system below. We hope to see you soon!
  </p>
  <div class="book-btn">
    <BookBtn />
  </div>
</section>

<style lang="scss">
  .hero-image {
    @include hero-image(url("/images/home.jpg"));
    background-position: 37% 85%;
    background-attachment: fixed;

    @include for-tablet-up {
      background-position: 37% 90%;
      height: 80vh;
    }
  }

  header,
  section {
    p {
      max-width: 700px;
      text-align: center;
    }
  }

  header {
    margin-bottom: 4rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media only screen and (max-width: 450px) {
Section {
  ul {
  width: 200%;
  transform: translateX(12%);
  padding-right: 25%;
}
}
}
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
    margin-bottom: 5rem;
    padding-right: 0;
    padding-left: 0;
    width: 100%;
    max-width: unset;

    @include for-tablet-up {
      margin-top: 3rem;
    }

    p {
      margin-bottom: 30px;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    img {
      border-radius: $border-radius;
      height: auto;
      width: 100%;
    }
  }

  .cider-list {
    display: flex;
    column-gap: 3rem;
    padding-top: 3rem;
    padding-left: 1rem;
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;

    @include for-desktop-up {
      justify-content: space-evenly;
      overflow: unset;
    }

    .list-item {
      display: block;
      text-align: center;

      &:last-of-type {
        margin-right: 1rem;
      }

      a {
        display: block;

        &:hover {
          img {
            transform: rotate(5deg);
          }
        }
      }

      img {
        margin-bottom: 1.5rem;
        width: 150px;
        transition: transform 0.1s ease-out;

        @include for-tablet-up {
          width: 228px;
        }
      }

      h3 {
        margin-bottom: 0.5rem;
      }

      p {
        padding: 0;
        color: #000;
        width: 200px;

        @include for-tablet-up {
          width: 300px;
        }
      }
    }
  }

  .shop-btn {
    margin-top: 1rem;
  }

  .restaurant-image {
    @include hero-image(url("/images/burger.jpg"));
    background-position: 30% 50%;
    margin-bottom: 1.5rem;
    background-attachment: fixed;
    height: 70vh;
    @include for-desktop-up {
      background-position: 80% 50%;
    }
  }

  .book-btn {
    text-align: center;
  }

  @media only screen and (max-device-width: 601px) {
    .hero-image,
    .restaurant-image {
      height: 50vh;
      background-attachment: scroll;
    }
  }
</style>
