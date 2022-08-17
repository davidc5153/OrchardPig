<script lang="ts">
  import Drawer, { Content, Header, Scrim } from "@smui/drawer";
  import List, { Item, Text, Separator } from "@smui/list";
  import IconButton from "@smui/icon-button";
  import { page, session } from "$app/stores";
  import Auth from "$lib/controllers/Auth";
  import Dialog, {
    Title,
    Content as DialogContent,
    Actions,
  } from "@smui/dialog";
  import Button, { Label } from "@smui/button";

  let openDrawer = false;
  let openDialog = false;

  // toggles the menu to open / close
  function toggleMenu() {
    openDrawer = !openDrawer;
  }
</script>

<!-- Menu Icon -->
<IconButton class="material-icons" on:click={toggleMenu}>menu</IconButton>

<!-- Menu Drawer -->
<div class="drawer-container">
  <Drawer class="drawer" variant="modal" fixed={false} bind:open={openDrawer}>
    <!-- Header -->
    <Header class="drawer-header">
      <!-- Logo -->
      <a
        class="drawer-site-logo"
        href="/"
        on:click={() => (openDrawer = false)}
      >
        <img
          src="/images/op-logo-white.png"
          height="50"
          width="86"
          alt="Orchard Pig site logo"
        />
      </a>
      <IconButton class="material-icons" on:click={toggleMenu}>
        close
      </IconButton>
    </Header>

    <Content>
      <List>
        <!-- About -->
        <Item
          class="drawer-item"
          href="/"
          on:click={() => (openDrawer = false)}
          activated={$page.url.pathname === "/"}
        >
          <Text>Home</Text>
        </Item>

        <!-- About -->
        <Item
          class="drawer-item"
          href="/about"
          on:click={() => (openDrawer = false)}
          activated={$page.url.pathname === "/about"}
        >
          <Text>About</Text>
        </Item>

        <!-- Products -->
        <Item
          class="drawer-item"
          href="/products"
          on:click={() => (openDrawer = false)}
          sveltekit:prefetch
          activated={$page.url.pathname === "/products"}
        >
          <Text>Products</Text>
        </Item>

        <!-- Restaurant -->
        <Item
          class="drawer-item"
          href="/restaurant"
          on:click={() => (openDrawer = false)}
          activated={$page.url.pathname === "/restaurant"}
        >
          <Text>Restaurant</Text>
        </Item>

        <!-- Contact -->
        <Item
          class="drawer-item"
          href="/contact"
          on:click={() => (openDrawer = false)}
          activated={$page.url.pathname === "/contact"}
        >
          <Text>Contact</Text>
        </Item>

        <Separator class="drawer-separator" />
        {#if $session.accessToken}
          <!-- Registered member options -->
          <Item
            class="drawer-item"
            href="/customer/bookings"
            on:click={() => (openDrawer = false)}
            sveltekit:prefetch
            activated={$page.url.pathname === "/customer/bookings"}
          >
            <Text>Bookings</Text>
          </Item>
          <Item
            class="drawer-item"
            href="/customer/orders"
            on:click={() => (openDrawer = false)}
            sveltekit:prefetch
            activated={$page.url.pathname === "/customer/orders"}
          >
            <Text>Orders</Text>
          </Item>
          <Item
            class="drawer-item"
            href="/customer/account"
            on:click={() => (openDrawer = false)}
            sveltekit:prefetch
            activated={$page.url.pathname === "/customer/account"}
          >
            <Text>Account</Text>
          </Item>

          <Separator class="drawer-separator" />
          <Item
            on:click={() => {
              openDialog = true;
              openDrawer = false;
            }}
            style="color: rgb(255 145 145);"
          >
            <Text>Sign out</Text>
          </Item>
        {:else}
          <!-- Guest options -->
          <Item
            class="drawer-item"
            href="/signin"
            on:click={() => (openDrawer = false)}
            activated={$page.url.pathname === "/signin"}
          >
            <Text style="font-weight: 550;">Sign in</Text>
          </Item>
        {/if}
      </List>
    </Content>
  </Drawer>
  <Scrim />
</div>

<Dialog
  bind:open={openDialog}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
  <Title id="simple-title" style="text-align: left;">Sign out</Title>
  <DialogContent id="simple-content">Are you sure?</DialogContent>
  <Actions>
    <Button style="color: rgb(171 0 0);" on:click={() => (openDialog = false)}>
      <Label>No</Label>
    </Button>
    <Button on:click={() => Auth.signout()}>
      <Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  /* These classes are only needed because the
    drawer is in a container on the page. */
  .drawer-container {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    height: 100%;
    z-index: 2;
  }

  * :global(.drawer) {
    background: #6d3304;
  }

  * :global(.drawer-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5em;
    margin-right: 0.5em;
    padding: 0;
  }

  * :global(.drawer-item) {
    color: #fff;
  }

  * :global(.drawer-separator) {
    background-color: #975724;
  }

  .drawer-site-logo {
    display: inline-flex;
    padding: 1rem;
  }
</style>
