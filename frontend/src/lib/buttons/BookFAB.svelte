<script lang="ts">
    import Fab, { Label } from '@smui/fab';
    import { prefetch } from "$app/navigation";
  
    export let label = "Book Now";
  </script>
  
  <Fab
    on:mouseover|once={() => prefetch("/restaurant/booking")} extended
    href="/restaurant/booking"
    title="Go to restaurant booking page"
    color="primary"
  >
    <Label>{label}</Label>
</Fab>

