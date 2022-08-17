<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Icon from "@smui/textfield/icon";
  import { PHONE_REGEX } from "$lib/util/regex";

  export let phone = "";
</script>

<Textfield
  variant="filled"
  bind:value={phone}
  type="tel"
  input$pattern={PHONE_REGEX}
  input$autocomplete="tel"
  label="Phone Number"
  required
>
  <Icon class="material-icons" slot="leadingIcon">phone</Icon>
  <HelperText validationMsg slot="helper">
    Please enter a valid phone number (8 or 9 digits).
  </HelperText>
</Textfield>
