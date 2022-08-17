<script lang="ts">
  import Button, { Label } from "@smui/button";
  import { prefetch } from "$app/navigation";

  export let label = "Book Now";
</script>

<Button
  on:mouseover|once={() => prefetch("/restaurant/booking")}
  href="/restaurant/booking"
  variant="raised"
  title="Go to restaurant booking page"
>
  <Label>{label}</Label>
</Button>
