<script lang="ts">
  import Button, { Label } from "@smui/button";

  export let label = "Check out";
  export let title = "Continue to checkout";
</script>

<Button href="/checkout" variant="raised" {title}>
  <Label>{label}</Label>
</Button>
