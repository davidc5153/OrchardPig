<script lang="ts">
  export let orders: Order[] = [];
  import Button, { Label } from "@smui/button";
  import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";
  import IconButton, { Icon } from "@smui/icon-button";
import Cart from "./util/Cart";

  let panelOpen = false;

  // initialise accordion panel state for each order.
  let openPanels: boolean[] = [];
  orders.forEach(() => {
    openPanels.push(false);
  });
</script>

{#if orders && orders.length > 0}
  <div class="accordions">
    <Accordion>
      <ul class="orders-list">
        {#each orders as { orderId, date, price, cart, shipping }, i}
          {@const dateObject = new Date(date)}
          <Panel bind:open={openPanels[i]}>
            <Header>
              <li>
                <h2>Order #{orderId}</h2>
                <span>{dateObject.toLocaleDateString("en-AU")}</span>
                <span>AUD {price}</span>
              </li>
              <IconButton slot="icon" toggle pressed={openPanels[i]}>
                <Icon class="material-icons" on>expand_less</Icon>
                <Icon class="material-icons">expand_more</Icon>
              </IconButton>
            </Header>
            <Content>
              <div class="content">
                {#if cart && cart.length > 0}
                  <div class="cart-list">
                    {#each cart as item}
                      {@const href = `/products/${item.product.id}`}
                      <div class="cart-item product-image">
                        <a sveltekit:prefetch {href} class="cart-item-image">
                          <img src={item.product.image} alt={item.product.alt} />
                        </a>
                      </div>
                      <div class="cart-item product-name">{item.product.name}</div>
                      <div class="cart-item product-qty">{item.quantity}</div>
                      <div class="cart-item product-price">
                          <span class="money price">{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    {/each}
                  </div>
                  {#if shipping && shipping !== "0.00"}
                    <div class="order-shipping">Shipping: AUD {shipping}</div>
                  {:else}
                    <div class="order-shipping">Free Shipping</div>
                  {/if}
                {/if}         
              </div>
            </Content>
          </Panel>
        {/each}
      </ul>
    </Accordion>
  </div>
{:else}
  <span class="empty">
    <img
      src="/images/noOrders.svg"
      height="168"
      width="300"
      alt="Two people looking in an empty box"
    />
    <h2>Looks like you don't have any current orders</h2>

    <Button href="/products" variant="raised" title="Go to Products page">
      <Label>Browse Products</Label>
    </Button>
  </span>
{/if}

<style lang="scss">
  .content {
    max-width: 100%;
    white-space: normal;
    overflow: hidden;

    .order-shipping {
      text-align: right;
    }

    .cart-list {
      display: grid;
      grid-template-columns: 1fr 2fr 2rem 1fr;
      column-gap: 1rem;
      /*
      row-gap: 3rem;
      */
      justify-items: center;
    }

    .cart-item {
      /* vertical-align: middle; */
      margin-top: auto;
      margin-bottom: auto;
      img {
        object-fit: contain;
        height: auto;
        width: 100%;
      }
      &.product-name {
        justify-self: start;
        text-align: left;
      }
      &.product-price {
        justify-self: end;
        text-align: right;
      }
    }
  }
</style>
