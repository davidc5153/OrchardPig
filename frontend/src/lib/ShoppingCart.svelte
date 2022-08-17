<script lang="ts">
  import CheckoutBtn from "$lib/buttons/CheckoutBtn.svelte";
  import ShopBtn from "$lib/buttons/ShopBtn.svelte";
  import Member from "$lib/controllers/Member";
  import { fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import Guest from "./controllers/guest/Guest";
  import loading from "../store/loading";
  import { session } from "$app/stores";
  import Cart from "./util/Cart";
  import Counter from "./Counter.svelte";
  import Button, { Label } from "@smui/button";

  // set prop to true to enable editing the cart
  export let enableEditing = false;

  $: cart = $session.cart;
  let accessToken: string = $session.accessToken;

  const DECIMAL_PLACES = 2;

  // keep track of cart total costs
  let subTotal = 0;
  let shippingCost = 0;
  let shippingTax = 0;
  $: total = subTotal + shippingCost + shippingTax;
  $: if (cart) {
    subTotal = Cart.calculateSubtotal(cart);
    shippingCost = Cart.calculateShipping(cart);
    shippingTax = Cart.calculateShippingTax(shippingCost);
  }

  async function setItemQty(itemIndex: number, quantity: number) {
    let difference: number = cart[itemIndex].quantity - quantity;
    return changeItemQty(itemIndex, difference);
  }
  // update cart items in database / localstorage
  async function changeItemQty(itemIndex: number, difference: number) {
    $loading = true;

    const product = cart[itemIndex].product;

    if (accessToken) {
      return Member.updateCart(cart, product, difference, accessToken)
        .then((result) => {
          $loading = false;
        })
        .catch((error) => {});
    }

    Guest.updateCart(cart, product, difference)
      .then((result) => {
        $loading = false;
      })
      .catch((error) => {});
  }
</script>

<!-- Display cart if it exists -->
{#if cart && cart.length > 0 && cart[0]}
  <section class="cart">
    {#if enableEditing}
      <h1>
        Your cart total is <span class="money subtotal"
          >{subTotal.toFixed(DECIMAL_PLACES)}</span
        >
      </h1>
      <div class="checkout-btn">
        <CheckoutBtn />
      </div>
    {/if}
    <!-- Display each cart item -->
    <ul class="cart-list">
      {#each cart as item, i (item.product.id)}
        {@const href = `/products/${item.product.id}`}
        <li
          transition:fade={{ duration: 250 }}
          animate:flip={{ duration: 200 }}
          class="cart-item"
        >
          <a sveltekit:prefetch {href} class="cart-item-image">
            <img
              src={item.product.image}
              width="75"
              height="100"
              alt={item.product.alt}
            />
          </a>
          <div class="cart-item-info">
            <span class="product-name">{item.product.name}</span>
            {#if enableEditing}
              <div class="cart-item-options">
                <div class="cart-item-qty">
                  <div
                    class="cart-counter"
                    on:click={() => setItemQty(i, item.quantity)}
                  >
                    <Counter bind:count={item.quantity} />
                  </div>
                  <div class="cart-item-remove">
                    <Button
                      on:click={() => changeItemQty(i, -cart[i].quantity)}
                    >
                      <Label>Remove</Label>
                    </Button>
                  </div>
                </div>
              </div>
            {:else}
              <div class="cart-item-options">
                <div class="cart-item-qty">{item.quantity}</div>
              </div>
            {/if}
            <span class="money price"
              >{(item.product.price * item.quantity).toFixed(
                DECIMAL_PLACES
              )}</span
            >
          </div>
        </li>
      {/each}
    </ul>
    <div class="cart-total">
      <div class="cart-subtotal">
        <span class="label">Subtotal</span>
        <span class="money subtotal">{subTotal.toFixed(DECIMAL_PLACES)}</span>
      </div>
      <div class="cart-subtotal">
        <span class="label">Shipping</span>
        <span class="money subtotal"
          >{shippingCost.toFixed(DECIMAL_PLACES)}</span
        >
      </div>
      <div class="cart-subtotal">
        <span class="label">Shipping Tax</span>
        <span class="money subtotal">{shippingTax.toFixed(DECIMAL_PLACES)}</span
        >
      </div>
      <div class="cart-subtotal">
        <span class="label">Total</span>
        <span class="money subtotal">{total.toFixed(DECIMAL_PLACES)}</span>
      </div>
      {#if enableEditing}
        <div class="cart-options">
          <div class="checkout-btn">
            <CheckoutBtn />
          </div>
          <div class="shop-btn">
            <ShopBtn />
          </div>
        </div>
      {/if}
    </div>
  </section>
{:else if enableEditing}
  <!-- Display empty cart -->
  <section class="cart-empty">
    <img
      src="/images/empty-cart.svg"
      width="300"
      height="250"
      alt="Empty shopping cart"
    />
    <h1>Your cart is empty</h1>
    <div class="shop-btn">
      <ShopBtn />
    </div>
  </section>
{/if}

<style lang="scss">
  section {
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  h1 {
    margin-top: unset;
    margin-bottom: unset;
    text-transform: unset;
    text-align: center;
    font-size: 3rem;

    @include for-tablet-up {
      font-size: 4rem;
    }
  }

  .cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: unset;

    .cart-list {
      display: inline-grid;
      row-gap: 2rem;
      --border: solid 2px #aaa;
      border-top: var(--border);
      border-bottom: var(--border);
      margin-top: 3rem;
      --padding-vertical: 3rem;
      padding: var(--padding-vertical) 1rem;
      width: 100%;
      max-width: 800px;

      @include for-tablet-up {
        --padding-vertical: 5rem;
      }
    }

    .cart-item {
      display: grid;
      grid-template-columns: 2fr 3fr;
      column-gap: 1rem;

      @include for-tablet-up {
        grid-template-columns: 2fr 5fr;
        column-gap: 1.5rem;
      }

      & .cart-item-image {
        margin-top: auto;
        margin-bottom: auto;
        @include for-small-mobile {
          display: none;
        }
      }

      img {
        justify-self: center;
        border-radius: $border-radius;
        height: auto;
        width: 100%;
        background-color: #fff;
        max-width: 200px;
      }
    }

    .cart-item-info {
      display: grid;
      // grid-template-columns: 3fr 2fr;
      column-gap: 1rem;
      text-align: center;

      @include for-tablet-up {
        /* grid-template-columns: 4fr 120px 2fr; */
        grid-template-columns: 4fr 4fr 2fr;
        text-align: left;
      }

      .product-name {
        display: block;
        margin-top: auto;
        margin-bottom: auto;

        @include for-tablet-up {
          /* margin-bottom: 1rem; */
          font-size: 1.1rem;
        }
      }

      .cart-item-options {
        margin-top: auto;
        margin-bottom: auto;

        @include for-tablet-up {
          justify-self: right;
        }

        .cart-item-qty {
          display: inline-block;

          input {
            width: 50px;
            text-align: center;

            // number spinners always visible
            &[type="number"]::-webkit-inner-spin-button,
            &[type="number"]::-webkit-outer-spin-button {
              opacity: 1;
            }
          }
        }

        .cart-item-remove {
          text-transform: uppercase;
          text-align: center;
          margin-top: -1rem;
        }
      }

      .price {
        font-weight: 600;
        margin-top: auto;
        margin-bottom: auto;

        @include for-tablet-up {
          text-align: right;
        }
      }
    }
  }

  .cart-total {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: 1rem;
    padding-bottom: 1rem;
    width: 100%;
    max-width: 800px;
    z-index: 2;

    .label {
      display: inline-block;
      margin-right: 1rem;
      text-transform: uppercase;
    }

    .subtotal {
      font-weight: 600;
      font-size: 1.2rem;
    }

    .cart-options {
      display: flex;
      flex-direction: row-reverse;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;

      @include for-tablet-up {
        // justify-content: space-around;
      }
    }
  }

  .cart-empty {
    margin-top: 3rem;
    margin-bottom: 4rem;
    text-align: center;

    img {
      height: auto;

      @include for-tablet-up {
        margin-top: 2rem;
      }
    }

    h1 {
      font-size: 3rem;
      margin-top: 2rem;

      @include for-tablet-up {
        font-size: 4rem;
      }
    }
  }

  .shop-btn,
  .checkout-btn {
    margin-top: 2rem;
  }
</style>
