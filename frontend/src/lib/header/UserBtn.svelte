<script lang="ts">
  import IconButton from "@smui/icon-button";
  import Icon from "@smui/icon-button";
  import Menu, { DefaultFocusState, MenuComponentDev } from "@smui/menu";
  import List, { Item, Separator, Graphic, Text } from "@smui/list";

  import { goto } from "$app/navigation";
  import { session } from "$app/stores";
  import Auth from "$lib/controllers/Auth";

  let menu: MenuComponentDev;

  $: signedIn = $session.accessToken ? true : false;

  let open = false;

  import Dialog, {
    Title,
    Content as DialogContent,
    Actions,
  } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  let openDialog = false;
</script>

<IconButton
  on:click={() => {
    menu.setOpen(true);
  }}
  aria-label="View account settings"
>
  <Icon class="material-icons">account_circle</Icon>
</IconButton>

<div class="user-menu">
  <Menu bind:this={menu} bind:open>
    <List>
      {#if signedIn}
        <Item on:SMUI:action={() => goto("/customer/bookings")}>
          <Text>Bookings</Text>
        </Item>

        <Item on:SMUI:action={() => goto("/customer/orders")}>
          <Text>Orders</Text>
        </Item>

        <Item on:SMUI:action={() => goto("/customer/account")}>
          <Text>Account</Text>
        </Item>

        <Separator />
        <Item on:SMUI:action={() => (openDialog = true)}>
          <Graphic class="material-icons">logout</Graphic>
          <Text style="color: red;">Sign out</Text>
        </Item>
      {:else}
        <Item on:SMUI:action={() => goto("/signin")} style="color: #326E93;">
          <Graphic class="material-icons" style="color: #326E93;"
            >person</Graphic
          >
          <Text>Sign in</Text>
        </Item>
      {/if}
    </List>
  </Menu>
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
  * :global(.mdc-menu) {
    top: 15px !important;
  }
</style>
