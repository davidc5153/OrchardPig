<script lang="ts">
  import { browser } from "$app/env";
  import { session } from "$app/stores";
  import { googleMapsApi } from "$lib/util/api";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Autocomplete from "@smui-extra/autocomplete";
  import Member from "$lib/controllers/Member";
  import Guest from "$lib/controllers/guest/Guest";

  const STATES = ["NSW", "QLD", "VIC", "ACT", "WA", "NT", "SA"];

  export let address = "";
  export let city = "";
  export let state = "";
  export let postcode = "";

  let addressInput: HTMLInputElement | null;

  function getAddressInput(element: HTMLElement) {
    addressInput = element.querySelector("input");
  }

  // initialise google maps autocomplete
  if (browser) {
    try {
      googleMapsApi.load().then((google) => {
        if (!addressInput) {
          return;
        }
        const autocomplete = new google.maps.places.Autocomplete(addressInput);

        // configure autocomplete options
        autocomplete.setComponentRestrictions({
          country: ["au"],
        });
        autocomplete.setFields(["address_components"]);

        // fill form fields with autocomplete address
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          let newAddress = "";
          let newPostcode = "";
          let newCity = "";
          let newState = "";

          for (const component of place.address_components) {
            const type = component.types[0];
            switch (type) {
              case "street_number": {
                newAddress = `${component.long_name} `;
                break;
              }
              case "route": {
                newAddress += component.short_name;
                break;
              }
              case "postal_code": {
                newPostcode = `${component.long_name}`;
                break;
              }
              case "administrative_area_level_1": {
                newState = component.short_name;
                break;
              }
              default:
                // locality is not always the first index in types
                // need to check the entire types array
                if (component.types.includes("locality")) {
                  newCity = component.long_name;
                }
            }
          }
          if (addressInput) {
            // overwrite google maps autocomplete address
            addressInput.value = address = newAddress;
          }
          city = newCity;
          state = newState;
          postcode = newPostcode;
        });
      });
    } catch (error) {
      console.error("Error loading Google Maps autocomplete.", error);
    }
  }

  export const saveAddress = async () => {
    if ($session.accessToken) {
      return Member.setAddress(
        address,
        city,
        state,
        postcode,
        $session.accessToken
      );
    }

    return Guest.setAddress(address, city, state, postcode);
  };
</script>

<div class="input-group" use:getAddressInput>
  <Textfield
    id="address"
    variant="filled"
    bind:value={address}
    type="text"
    input$autocomplete="street-address"
    label="Address"
    required
  >
    <HelperText validationMsg slot="helper">
      Please enter your street number and address.
    </HelperText>
  </Textfield>
</div>

<div class="input-group">
  <Textfield
    id="city"
    variant="filled"
    bind:value={city}
    type="text"
    input$autocomplete="address-level2"
    label="City / Suburb"
    required
  >
    <HelperText validationMsg slot="helper"
      >Please enter a city / suburb.</HelperText
    >
  </Textfield>
</div>
<div class="row">
  <div class="input-group">
    <Autocomplete
      textfield$variant="filled"
      options={STATES}
      bind:value={state}
      label="State"
      textfield$required
    />
  </div>

  <div class="input-group">
    <Textfield
      id="postcode"
      variant="filled"
      bind:value={postcode}
      type="text"
      input$autocomplete="postal-code"
      label="Postcode"
      required
    >
      <HelperText validationMsg slot="helper">
        Please enter a valid postcode.
      </HelperText>
    </Textfield>
  </div>
</div>

<style>
  .row {
    display: flex;
    column-gap: 1rem;
  }
</style>
