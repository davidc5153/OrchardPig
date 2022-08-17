<script lang="ts">
  import Button, { Label } from "@smui/button";

  export let label = "Available time slots";
  export let timeSlots: string[] | null = [];

  export let loading: boolean | null = true;

  export let selectedTime: string | null = null;
</script>

<section>
  <h2>{label}</h2>
  {#key loading}
    <div class="time-slots">
      {#if loading}
        <div class="time-slot-skeleton" />
        <div class="time-slot-skeleton" />
      {:else if timeSlots && timeSlots.length > 0}
        {#each timeSlots as time}
          <Button
            on:click={() => {
              selectedTime = time;
            }}
            variant="raised"
            title="Select {time} as booking time"
          >
            <Label>{time}</Label>
          </Button>
        {/each}
      {:else}
        <span>No available times</span>
      {/if}
    </div>
  {/key}
</section>

<style lang="scss">
  section {
    margin-bottom: 4rem;
  }

  h2 {
    font-size: 2.5rem;
    text-align: left;
    color: var(--secondary-color);
  }

  .time-slots {
    display: grid;
    column-gap: 3rem;
    row-gap: 1rem;

    @include for-tablet-up {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .time-slot-skeleton {
    border-radius: 4px;
    width: 100%;
    height: 60px;
    background-color: #ccc;
  }
</style>
