<script lang="ts">
  import Button, { Label } from "@smui/button";
  import { prefetch } from "$app/navigation";

  export let label = "Keep shopping";
</script>

<!-- fetches product data when user hovers button (next page loads faster)-->
<Button
  on:mouseover|once={() => prefetch("/products")}
  href="/products"
  variant="raised"
  title="Go to Products page"
>
  <Label>{label}</Label>
</Button>
