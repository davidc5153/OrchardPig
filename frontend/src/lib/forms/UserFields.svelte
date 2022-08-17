<script lang="ts">
  import PhoneField from "./PhoneField.svelte";
  import BirthdayField from "./BirthdayField.svelte";
  import NameFields from "./NameFields.svelte";

  // user details
  export let firstName = "";
  export let lastName = "";
  export let dob = "";
  export let phone = "";
  export let checkValidAge: () => boolean;
</script>

<NameFields bind:firstName bind:lastName />

<div class="input-group">
  <BirthdayField bind:dob bind:checkValidAge />
</div>

<div class="input-group">
  <PhoneField bind:phone />
</div>
