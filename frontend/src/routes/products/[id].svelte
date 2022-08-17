<script context="module" lang="ts">
  import { BASE_URL } from "$lib/util/api";
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";

  export async function load({
    params,
    fetch,
  }: LoadInput): Promise<LoadOutput> {
    // fetch product for specified id
    let URL = `${BASE_URL}/product/${params.id}`;
    let productPromise = fetch(URL);

    let productRes = await productPromise;
    if (productRes.ok) {
      let productData = await productRes.json();

      if (!productData) {
        return {
          status: productRes.status,
          error: new Error(`Could not load ${URL}`),
        };
      }
      console.log(`GET > /product/${params.id} : ${productData.name}`);

      // fetch other products
      let recommendedPromise = fetch(
        `${BASE_URL}/product?type=${productData.type.toUpperCase()}`
      );

      let recommendedRes = await recommendedPromise;
      let recommended;
      if (recommendedRes.ok) {
        recommended = recommendedRes.json();
      }

      if (recommended) {
        recommended = await recommended;

        if (recommended.products) {
          console.log(
            `GET > /product : retrieved ${recommended.products?.length} items`
          );
          const currentProductId = parseInt(params.id);
          recommended = recommended.products?.filter((product: Product) => {
            if (product.id !== currentProductId) return product;
          });
        } else {
          console.error(`GET > /product : invalid response`);
        }
      } else {
        console.error(`GET > /product : request failed`);
      }

      return {
        props: {
          product: productData,
          recommended: recommended,
        },
      };
    }

    return {
      status: productRes.status,
      error: new Error(`Could not load ${URL}`),
    };
  }

  export const prerender = true;
</script>

<script lang="ts">
  import Button, { Label } from "@smui/button";
  import Counter from "$lib/Counter.svelte";
  import { session } from "$app/stores";
  import ProductList from "$lib/ProductList.svelte";
  import Guest from "$lib/controllers/guest/Guest";
  import Member from "$lib/controllers/Member";
  import Breadcrumb from "$lib/Breadcrumb.svelte";
  import { getContext } from "svelte";
  import { goto } from "$app/navigation";
  const { notifyUser } = getContext("notify");
  import loading from "../../store/loading";

  export let product: Product;
  export let recommended: Product[];

  let currentQuantity = 1;

  // add item to cart when user clicks submit
  async function submitHandler(quantity: number, product: Product) {
    if (currentQuantity < 1) {
      console.error(`${quantity} is an invalid quantity. Must be at least 1.`);
      // $notification("You must add at least 1 item to the cart.");
      return;
    }

    // check if cart exists
    if (!$session.cart) {
      console.error(
        "Unable to add product to cart. Cart has not been initialised."
      );
      return;
    }

    $loading = true;

    if ($session.accessToken) {
      await Member.updateCart(
        $session.cart,
        product,
        currentQuantity,
        $session.accessToken
      );
    } else {
      await Guest.updateCart($session.cart, product, currentQuantity);
    }

    $loading = false;

    notifyUser({
      label: `${quantity}x ${product.name} added to your cart.`,
      actions: [
        {
          onClick: () => goto("/cart"),
          text: "View cart",
        },
      ],
      dismissButton: true,
    });
  }

  $: category = product.type.toLowerCase();
  $: breadcrumbs = [
    { href: "/products", text: "Products" },
    { href: `/products#${category}`, text: category },
    { href: `/products/${product.id}`, text: product.name },
  ];
</script>

<svelte:head>
  <title>{product.name} – Orchard Pig</title>
  <!-- makes an early connection to the server hosting the images so they load faster -->
  <link
    rel="preconnect"
    href="https://orchardpigproducts.s3.ap-southeast-2.amazonaws.com"
  />
</svelte:head>

<header>
  <Breadcrumb items={breadcrumbs} />
</header>

<article id="product">
  <div class="product-image">
    <img src={product.image} width="325" height="325" alt={product.alt} />
  </div>
  <div class="product-info">
    <h1>{product.name}</h1>
    <span class="money">{product.price}</span>
    <p>{product.description}</p>
    <div class="product-options">
      <Counter bind:count={currentQuantity} />
      <div class="submit-btn">
        <Button
          on:click={() => submitHandler(currentQuantity, product)}
          variant="raised"
        >
          <Label>Add to cart</Label>
        </Button>
      </div>
    </div>
  </div>
</article>

<section id="recommended">
  <h2>You might also like</h2>
  <ProductList products={recommended} row />
</section>

<style lang="scss">
  header,
  section {
    display: inline-block;
    width: 100%;
    max-width: 900px;
  }

  #product {
    padding-left: 1rem;
    padding-right: 1rem;

    @media only screen and (min-width: 870px) {
      display: flex;
      flex-wrap: wrap;
      column-gap: 2rem;
      width: 100%;
      max-width: 900px;
    }

    h1 {
      margin-bottom: 1rem;
      padding: 0;
      text-align: left;
      font-size: 3rem;
    }

    img {
      border-radius: $border-radius;
      margin-bottom: 1rem;
      height: auto;
      width: 350px;
      background: #fff;

      @include for-mobile-only {
        width: 100%;
      }
    }

    .money {
      display: block;
      margin-bottom: 1rem;
      font-size: 1.5rem;
      color: $secondary-color;
    }

    p {
      margin-left: unset;
      margin-bottom: 2rem;
      max-width: 450px;
    }
  }

  .product-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    column-gap: 2.5rem;
    row-gap: 1rem;
  }

  #recommended {
    margin-top: 5rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    max-width: unset;

    h2 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
  }
</style>
