<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Icon from "@smui/textfield/icon";
  import { EMAIL_REGEX } from "$lib/util/regex";

  export let email = "";
  export let disabled = false;
</script>

<Textfield
  variant="filled"
  bind:value={email}
  type="email"
  input$pattern={EMAIL_REGEX}
  input$autocomplete="email"
  label="Email"
  required
  {disabled}
>
  <Icon class="material-icons" slot="leadingIcon">mail</Icon>
  <HelperText validationMsg slot="helper">
    Please enter a valid email address.
  </HelperText>
</Textfield>
