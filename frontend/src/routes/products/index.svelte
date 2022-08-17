<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  import { BASE_URL } from "$lib/util/api";

  function sortProducts(products: Product[]) {
    const ciders: Product[] = [];
    const merch: Product[] = [];
    const bundles: Product[] = [];

    products.forEach((product) => {
      switch (product.type) {
        case "CIDER":
          ciders.push(product);
          break;
        case "MERCH":
          merch.push(product);
          break;
        case "BUNDLE":
          bundles.push(product);
          break;
        default:
          break;
      }
    });

    return { ciders: ciders, merch: merch, bundles: bundles };
  }

  // Uses native fetch to allow page prerendering
  export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
    const URL = `${BASE_URL}/product`;

    const res = await fetch(URL);

    if (res.ok) {
      let data = await res.json();
      console.log(`GET > /product success: ${data.products.length} items`);
      return {
        props: sortProducts(data.products),
      };
    }

    return {
      status: res.status,
      error: new Error(`Could not load ${URL}`),
    };
  }

  export const prerender = true;
</script>

<script lang="ts">
  import ProductList from "$lib/ProductList.svelte";
  export let ciders: Product[], merch: Product[], bundles: Product[];
  import BackToTopBtn from "$lib/buttons/BackToTopBtn.svelte";
</script>

<svelte:head>
  <title>Products – Orchard Pig</title>
  <link
    rel="preconnect"
    href="https://orchardpigproducts.s3.ap-southeast-2.amazonaws.com"
  />
</svelte:head>

<!-- cover image added in CSS -->
<div class="hero-image" />

<section id="cider">
  <div class="products-head">
    <h2>Our ciders</h2>
    <div class="prod-info">
      <p>
        Our bittersweet cider apples are plucked from our Margaret River
        orchard, expertly blended to create our own signature taste and left to
        mature into the cider we all love.
      </p>
    </div>
  </div>
  <div class="ciders-grid">
    <ProductList products={ciders} />
  </div>
</section>

<section id="merch">
  <div class="products-head">
    <h2>Merch</h2>
    <div class="prod-info">
      <p>Stock up your sty…</p>
      <p>
        Go the whole hog and kit yourself out with these a-peeling t-shirts,
        bags, socks, and barware.
      </p>
    </div>
  </div>
  <div class="merch-grid">
    <ProductList products={merch} />
  </div>
</section>

<section id="bundle">
  <div class="products-head">
    <h2>Bundles</h2>
    <div class="prod-info">
      <p>
        Choose from a selection of bundles displaying of our finest products –
        all ready for epic gifts and muddy good times!
      </p>
    </div>
  </div>
  <div class="bundles-grid">
    <ProductList products={bundles} />
  </div>
</section>

<style lang="scss">
  section {
    margin-bottom: 6rem;
    padding-left: 1rem;
    padding-right: 1rem;
    max-width: unset;
  }

  h2 {
    margin-bottom: 1rem;
    text-align: center;
  }

  p {
    max-width: 600px;
  }

  .hero-image {
    @include hero-image(url("/images/product.jpg"));
    background-position: 50% 40%;
    height: 70vh;
  }

  .products-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
    margin-bottom: 4rem;
  }

  .prod-info {
    max-width: 800px;
    text-align: center;
  }
  @media only screen and (max-device-width: 601px) {
    .hero-image {
      height: 50vh;
      background-attachment: scroll;
    }
  }
</style>
