<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Icon from "@smui/textfield/icon";

  const PASSWORD_REGEX = "^(?=.*?[A-Za-z0-9]).{6,}$";

  export let newPassword = false;
  export let helperText = "Please enter your password.";

  export let password = "";
</script>

{#if newPassword}
  <Textfield
    variant="filled"
    bind:value={password}
    type="password"
    input$pattern={PASSWORD_REGEX}
    input$autocomplete="new-password"
    label="Password"
    required
  >
    <Icon class="material-icons" slot="leadingIcon">key</Icon>
    <HelperText validationMsg slot="helper">
      Please enter a new password (6 or more letters or numbers)
    </HelperText>
  </Textfield>
{:else}
  <Textfield
    variant="filled"
    bind:value={password}
    input$autocomplete="current-password"
    type="password"
    label="Password"
    required
  >
    <HelperText validationMsg slot="helper">
      {helperText}
    </HelperText>
  </Textfield>
{/if}
