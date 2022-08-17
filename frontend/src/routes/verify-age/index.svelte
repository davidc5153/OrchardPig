<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  import { browser } from "$app/env";
  import verifiedAge from "../../store/verifiedAge";

  export async function load({ url }: LoadInput): Promise<LoadOutput> {
    // pathname before user was redirected to this page
    let ref = url.searchParams.get("ref");
    // set ref url to Home page if the param is empty
    if (!ref) {
      ref = "/";
    }

    if (browser) {
      // check if user has verified their age
      let verified;
      verifiedAge.subscribe((value) => {
        verified = value;
      });

      // skip verification page
      if (verified) {
        return {
          status: 302,
          redirect: ref,
        };
      }
    }

    // pass the referral page url
    return {
      props: {
        ref: ref,
      },
    };
  }
  export const prerender = false;
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  import Button, { Label } from "@smui/button";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Icon from "@smui/textfield/icon";
  import verifyLegal from "$lib/util/verifyLegalAge";

  let dob = "";
  $: illegalAge = false;

  function submitHandler() {
    // check if age is 18 or over
    illegalAge = !verifyLegal(new Date(dob));
    if (illegalAge) {
      return;
    }

    // return to referring url or Home page
    $verifiedAge = true;
    goto(ref);
  }

  // pathname before user was redirected to this page
  export let ref = "/";
</script>

<svelte:head>
  <title>Verify Your Age - Orchard Pig</title>
</svelte:head>

<main>
  <section>
    <img
      src="/images/op-logo-white.png"
      width="234px"
      height="136px"
      alt="Orchard Pig logo"
    />
    {#if illegalAge}
      <div class="sorry" transition:fade>
        <h1>Sorry! You're too young</h1>
        <p>You can come back when you're 18 years or older.</p>
      </div>
    {:else}
      <h1>When's your birthday?</h1>
      <form on:submit|preventDefault={submitHandler}>
        <div class="input-group">
          <Textfield
            class="error"
            variant="filled"
            bind:value={dob}
            type="date"
            input$autocomplete="bday"
            label="Date of Birth"
            required
          >
            <Icon class="material-icons" slot="leadingIcon">event</Icon>
            <HelperText
              style="margin-top: 1rem; color: #EEE;"
              persistent
              slot="helper"
            >
              You have to be at least 18 years old to enter this site.
            </HelperText>
          </Textfield>
        </div>
        <Button variant="raised" title="Confirm you're of legal age">
          <Label>Verify age</Label>
        </Button>
      </form>
    {/if}
  </section>
</main>

<style lang="scss">
  main {
    background: $primary-color;
  }

  section {
    @include col;
    align-items: center;
    max-width: unset;
    text-align: center;
    color: #fff;
  }

  img {
    margin-top: 6rem;
    margin-bottom: 2rem;
    height: auto;
    width: 50%;
    max-width: 300px;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }

  p {
    margin-bottom: 1rem;
  }

  .input-group {
    margin-bottom: 2rem;
  }

  .sorry {
    margin-top: 2rem;
  }
</style>
