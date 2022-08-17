<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import CharacterCounter from "@smui/textfield/character-counter";
  import Button, { Label } from "@smui/button";
  import Icon from "@smui/textfield/icon";
  import EmailField from "$lib/forms/EmailField.svelte";
  import { session } from "$app/stores";
  import { getContext } from "svelte";
  import InlineNotification from "$lib/InlineNotification.svelte";
  const { notifyUser } = getContext("notify");

  let name = "";
  let email = "";
  let message = "";
  let disabled = false;

  // prefills name and email values if values exist in session
  if ($session.user) {
    name = `${$session.user.firstName} ${$session.user.lastName}`;
    email = $session.user.email;
  }

  function submitHandler() {
      disabled = true;
  }
</script>

<form on:submit|preventDefault={submitHandler}>
  <InlineNotification
    display={disabled}
    label="Your message was sent"
    type="success">We'll contact you within 24 hours.</InlineNotification
  >

  <div class="input-group">
    <Textfield
      variant="filled"
      bind:value={name}
      type="text"
      input$autocomplete=""
      label="Name"
      required
      {disabled}
    >
      <Icon class="material-icons" slot="leadingIcon">person</Icon>
      <HelperText validationMsg slot="helper">
        Please enter your name.
      </HelperText>
    </Textfield>
  </div>

  <div class="input-group">
    <EmailField bind:email {disabled} />
  </div>

  <div class="input-group">
    <Textfield
      style="height: 200px;"
      textarea
      variant="filled"
      input$maxlength={250}
      bind:value={message}
      label="Message"
      required
      {disabled}
    >
      <CharacterCounter slot="internalCounter">0 / 100</CharacterCounter>
      <HelperText validationMsg slot="helper">
        Please enter a message.
      </HelperText>
    </Textfield>
  </div>

  <div class="submit-btn">
    <Button variant="raised" title="Send message" {disabled}>
      <Label>Send message</Label>
    </Button>
  </div>
</form>

<style lang="scss">
  form {
    margin-bottom: 4rem;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
  }
</style>
