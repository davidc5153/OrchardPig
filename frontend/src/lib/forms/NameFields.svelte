<script lang="ts">
  import Textfield, { TextfieldComponentDev } from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import { NAME_REGEX } from "$lib/util/regex";

  export let firstName = "";
  export let lastName = "";
</script>

<div class="name-fields">
  <div class="input-group">
    <Textfield
      variant="filled"
      bind:value={firstName}
      type="text"
      input$pattern={NAME_REGEX}
      input$autocomplete="given-name"
      label="First Name"
      required
    >
      <HelperText validationMsg slot="helper">
        Please enter your first name.
      </HelperText>
    </Textfield>
  </div>

  <div class="input-group">
    <Textfield
      variant="filled"
      bind:value={lastName}
      type="text"
      input$pattern={NAME_REGEX}
      input$autocomplete="family-name"
      label="Last Name"
      required
    >
      <HelperText validationMsg slot="helper">
        Please enter your last name.
      </HelperText>
    </Textfield>
  </div>
</div>

<style lang="scss">
  .name-fields {
    display: flex;
    flex-wrap: wrap;
    --gap: 1.5rem;
    column-gap: var(--gap);
    width: 100%;

    .input-group {
      width: 100%;

      @include for-tablet-up {
        width: calc(50% - (var(--gap) / 2));
      }
    }
  }
</style>
