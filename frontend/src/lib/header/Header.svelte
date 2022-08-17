<script lang="ts">
  import TopAppBar, {
    Row,
    Section,
    Title,
    AutoAdjust,
    TopAppBarComponentDev,
  } from "@smui/top-app-bar";
  import DrawerMenuButton from "$lib/header/DrawerMenu.svelte";
  import CartButton from "$lib/header/CartBtn.svelte";
  import UserButton from "$lib/header/UserBtn.svelte";
  let topAppBar: TopAppBarComponentDev;

  import { page } from "$app/stores";
  import { currentPageTitle } from "../../store/index";
</script>

<TopAppBar bind:this={topAppBar}>
  <Row>
    <Section style="justify-content: center; order: 1; width: 100%;">
      <div class="nav-bar-title">
        <Title
          style="padding-left: 0; cursor: pointer; font-size: 18px;"
          on:click={() => document.body.scrollIntoView()}
          >{$currentPageTitle}</Title
        >
      </div>
      <nav>
        <ul>
          <li class:active={$page.url.pathname === "/about"}>
            <a href="/about">About</a>
          </li>
          <li class:active={$page.url.pathname === "/products"}>
            <a sveltekit:prefetch href="/products">Products</a>
          </li>
          <li>
            <!-- Logo Home Button -->
            <a class="site-logo" href="/" title="Go to Home page">
              <img
                src="/images/op-logo-white.png"
                height="50"
                width="86"
                alt="Orchard Pig site logo"
              />
            </a>
          </li>
          <li class:active={$page.url.pathname === "/restaurant"}>
            <a href="/restaurant">Restaurant</a>
          </li>
          <li class:active={$page.url.pathname === "/contact"}>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </Section>
    <!-- Cart Button -->
    <Section align="end" toolbar>
      <UserButton />
    </Section>

    <!-- Cart Button -->
    <Section align="end" toolbar>
      <CartButton />
    </Section>

    <!-- Menu Drawer Button -->
    <Section align="start">
      <DrawerMenuButton />
    </Section>
  </Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
  <!-- SMUI TopAppBar wraps slot content in <main> -->
  <slot />
</AutoAdjust>

<style lang="scss">
  /* Hide everything above this component. */
  :global(app),
  :global(body),
  :global(html) {
    display: block !important;
    height: auto !important;
    width: auto !important;
    position: static !important;
  }

  nav {
    // hide nav bar links in mobile because of small screen
    display: none;
    width: 100%;

    ul {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    li {
      display: inline-flex;
      justify-content: center;
      width: 20%;
      max-width: 150px;
    }

    a:not(.site-logo) {
      display: block;
      border-radius: 10px;
      --margin: 0.2rem;
      margin-left: var(--margin);
      margin-right: var(--margin);
      padding: 0.8rem 0;
      width: 100%;

      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.03em;
      color: #fff;
      text-align: center;
      text-decoration: none;

      transition: background 0.15s ease-out, color 0.15s ease-out;

      @include for-desktop-up {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      &:hover {
        background: darken($primary-color, 2%);
      }
    }

    .active {
      a {
        color: #aaa;
        background: darken($primary-color, 5%);

        &:hover {
          background: darken($primary-color, 5%);
        }
      }
    }
  }

  .site-logo {
    display: inline-flex;
    padding: 0 1.5rem;
    cursor: pointer;
    transition: opacity 0.1s ease-out;
  }

  // replace page title with nav bar links for larger screens
  @include for-tablet-up {
    nav {
      display: block;
    }

    .nav-bar-title {
      display: none;
    }
  }
</style>
