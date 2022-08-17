<script lang="ts">
  import Button, { Label } from "@smui/button";

  export let label = "Back to Home";
</script>

<Button href="/" variant="raised" title="Back to Home">
  <Label>{label}</Label>
</Button>
