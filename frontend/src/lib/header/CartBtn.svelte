<script lang="ts">
  import IconButton from "@smui/icon-button";
  import Icon from "@smui/icon-button";
  import Badge from "@smui-extra/badge";

  import { goto } from "$app/navigation";
  import { session } from "$app/stores";

  function getTotalCartItems(cart: CartItem[]) {
    // check if cart exists or is empty
    if (!cart || cart.length < 1 || !cart[0]) {
      return 0;
    }

    if (cart.length > 1) {
      // calculate sum of quantities for each item
      return cart.reduce((previousValue: number, currentItem: CartItem) => {
        return previousValue + currentItem.quantity;
      }, initialValue);
    }

    // if only 1 item in the cart
    return cart[0].quantity;
  }

  let initialValue = 0;
  let totalItems = 0;
  $: totalItems = getTotalCartItems($session.cart);
</script>

<IconButton on:click={() => goto("/cart")} aria-label="View shopping cart">
  <Icon class="material-icons">shopping_cart</Icon>
  {#if totalItems > 0}
    <Badge aria-label="total shopping cart items">{totalItems}</Badge>
  {/if}
</IconButton>
