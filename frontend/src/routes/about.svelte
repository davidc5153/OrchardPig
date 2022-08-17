<script context="module">
  // since there's no dynamic data here, we can prerender
  // it so that it gets served as a static asset in prod
  export const prerender = true;
</script>

<script>
  import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";
  import IconButton, { Icon } from "@smui/icon-button";
  import { currentPageTitle } from "../store/index";
  import BookFAB from "$lib/buttons/BookFAB.svelte";
  import BackToTopBtn from "$lib/buttons/BackToTopBtn.svelte";
  $currentPageTitle = "About";

  let panel1Open = false;
  let panel2Open = false;
  let panel3Open = false;
  let panel4Open = false;
  let panel5Open = false;
</script>

<svelte:head>
  <title>About – Orchard Pig</title>
</svelte:head>

<div class="hero-image" />

<header>
  <h1>Not your average cidery</h1>
  <p>
    Founded in the noughties in Sommerset, UK, Orchard Pig Australia is the next
    step in our future and mission to add mischief to the mainstream!
  </p>
  <p>
    Located in the idyllic Margaret River Region, our cidery boasts a range of
    delicious ciders, as well as our five-star restaurant, The Flying Pig, which
    showcases the incredible local produce of the region.
  </p>
  <p>
    Unlike many other cideries, Orchard Pig strives to deliver fresh-tasting,
    authentic ciders without the cloying sweetness.
  </p>
</header>

<section id="awards">
  <h2>Industry awards</h2>
  <ul id="awards-list">
    <li class="award">
      <img
        src="/images/cidercraft-awards.png"
        width="200"
        alt="Cidercraft Awards badge"
      />
      <h3>2017</h3>
      <p>
        The Hogfather won 2nd place at the Cidercraft Awards in 2017. Judge
        Julia Wilson said "the carbonation level was perfect, and light as
        suggested. There was some level of tang, which quickly emerged after the
        first sip... As for taste, there wasn’t a clearly discernible sweetness,
        yet the slicing tang made up for this no end, with no hint of anything
        artificial."
      </p>
    </li>
    <li class="award">
      <img
        src="/images/australian-cider-awards.png"
        width="200"
        alt="Australian Cider Awards badge"
      />
      <h3>2021</h3>
      <p>
        After entering the Australian Cider Awards on a whim, Orchard Pig's
        Reveller came in 1st place! What a pleasant surprise! Judge Peter Thomas
        said "The scent of orchards and fallen apples is the first thing that
        hits you. The light fizz carries notes of over ripe apples creating an
        image of wind fall apples lying on the orchard floor with the “Orchard
        Pig” rooting about and gobbling the last of the season’s fruit."
      </p>
    </li>
    <li class="award">
      <img
        src="/images/world-cider-awards.jpg"
        width="200"
        alt="World Cider Awards badge"
      />
      <h3>2021</h3>
      <p>
        The Reveller wins 1st at the World CIder Awards! The judges noted the
        "Pale, clear with mid range fizz. Light apple aroma with smokey notes.
        Refreshing with a hint of citrus and a small amount of funk. Full body
        refreshing cider."
      </p>
    </li>
  </ul>
</section>

<section id="faq">
  <h2>FAQ</h2>
  <div class="accordions">
    <Accordion>
      <Panel bind:open={panel1Open}>
        <Header>
          <h3>Is Orchard Pig Australia the same as Orchard Pig UK?</h3>
          <IconButton slot="icon" toggle pressed={panel1Open}>
            <Icon class="material-icons" on>expand_less</Icon>
            <Icon class="material-icons">expand_more</Icon>
          </IconButton>
        </Header>
        <Content>
          <p>
            While our products, mission and business are fundamentally the same,
            the one main difference between us is that Orchard Pig Australia
            uses Australian Grown Varieties of apples, whereas Orchard Pig UK uses
            Heirloom UK Varieties – and while the taste of the product is
            similar, each branch offers a unique experience.
          </p>
        </Content>
      </Panel>

      <Panel bind:open={panel2Open}>
        <Header>
          <h3>Are Orchard Pig Ciders vegetarian/vegan?</h3>
          <IconButton slot="icon" toggle pressed={panel2Open}>
            <Icon class="material-icons" on>expand_less</Icon>
            <Icon class="material-icons">expand_more</Icon>
          </IconButton>
        </Header>
        <Content>
          <p>
            Yes, our ciders are suitable for vegan, vegetarian and fruitarian
            diets.
          </p>
        </Content>
      </Panel>

      <Panel bind:open={panel3Open}>
        <Header>
          <h3>Does the Flying Pig restaurant allow kids?</h3>
          <IconButton slot="icon" toggle pressed={panel3Open}>
            <Icon class="material-icons" on>expand_less</Icon>
            <Icon class="material-icons">expand_more</Icon>
          </IconButton>
        </Header>
        <Content>
          <p>
            While the bar and alcoholic products are restricted to over 18s,
            kids are always welcome to pig out at the restaurant, or muck around
            in our on-site playground.
          </p>
        </Content>
      </Panel>

      <Panel bind:open={panel4Open}>
        <Header>
          <h3>What measures are Orchard Pig taking in regards to COVID-19?</h3>
          <IconButton slot="icon" toggle pressed={panel4Open}>
            <Icon class="material-icons" on>expand_less</Icon>
            <Icon class="material-icons">expand_more</Icon>
          </IconButton>
        </Header>
        <Content>
          <p>
            Orchard Pig values the sanctity of life, and thusly we maintain an
            onsite SafeWA Contact Registry, and comply with government
            directions regarding maximum occupancy and encourage social
            distancing.
          </p>
        </Content>
      </Panel>

      <Panel bind:open={panel5Open}>
        <Header>
          <h3>What days are you closed?</h3>
          <IconButton slot="icon" toggle pressed={panel5Open}>
            <Icon class="material-icons" on>expand_less</Icon>
            <Icon class="material-icons">expand_more</Icon>
          </IconButton>
        </Header>
        <Content>
          <p>
            Cellar Door is closed New Year's Day, Good Friday, ANZAC Day, Christmas Day and Boxing Day. Restaurant is closed New Year's Day, Christmas Day and Boxing Day. Our online store is open 24/7.
          </p>
        </Content>
      </Panel>
    </Accordion>
  </div>

  <div class="other">
    <h3>For all other enquiries</h3>
    <p>
      Please see our <a href="/contact" title="Link to Contact page">contact</a>
      page and get in touch – we’d love to hear from you!
    </p>
  </div>
</section>

<style lang="scss">
  .hero-image {
    @include hero-image(url("/images/about.jpg"));
    height: 70vh;
    background-position: 50% 30%;
    background-attachment: fixed;
    @include for-desktop-up {
      background-position: 50% 40%;
    }
  }

  header,
  section {
    padding: 2rem 1rem 3rem 1rem;
    text-align: center;
  }

  li {
    @include center-margins;
    margin-bottom: 5rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  h2 {
    margin-bottom: 2rem;
  }

  h3 {
    font-family: var(--font-family-secondary);
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 120%;
  }

  p {
    margin-bottom: 2rem;
  }

  #awards {
    max-width: unset;

    li {
      vertical-align: top;
      display: inline-block;
      max-width: 400px;

      @include for-tablet-up {
        --margin: 2rem;
        margin-left: var(--margin);
        margin-right: var(--margin);
      }
    }

    img {
      margin-bottom: 1rem;
      height: auto;
    }

    h3 {
      margin-bottom: 1rem;
    }
  }

  #faq {
    .accordions {
      margin-bottom: 2rem;
      padding: 0;
      text-align: left;

      h3,
      p {
        padding: 0;
      }

      h3 {
        font-size: 1.2rem;
      }

      p {
        margin: 0;
      }
    }

    .other {
      padding-top: 2rem;

      h3 {
        margin-bottom: 1rem;
      }

      p {
        max-width: 450px;
      }
    }
  }

  @media only screen and (max-device-width: 601px) {
    .hero-image {
      height: 50vh;
      background-attachment: scroll;
    }
  }
</style>
