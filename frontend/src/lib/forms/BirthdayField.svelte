<script lang="ts">
  import Textfield, { TextfieldComponentDev } from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Icon from "@smui/textfield/icon";
  import verifyLegalAge from "$lib/util/verifyLegalAge";

  export let dob = "";

  let isValidAge = true;
  let dateInput: TextfieldComponentDev;

  function validateAge() {
    isValidAge = verifyLegalAge(new Date(dob));
  }

  // checks if date of birth input is 18 or older
  export function checkValidAge(): boolean {
    validateAge();

    // check valid age
    if (!isValidAge) {
      dateInput.focus();
      return false;
    }

    return true;
  }
</script>

<Textfield
  variant="filled"
  on:blur={validateAge}
  bind:value={dob}
  bind:this={dateInput}
  invalid={!isValidAge}
  type="date"
  input$autocomplete="bday"
  label="Date of Birth"
  required
>
  <Icon class="material-icons" slot="leadingIcon">event</Icon>
  <HelperText validationMsg slot="helper">
    You must be at least 18 years old
  </HelperText>
</Textfield>
