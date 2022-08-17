<script lang="ts">
  export let products: Product[] = [];
  export let row = false;

  $: type = row ? "row" : "grid";
</script>

{#if products.length}
  <ul class={type}>
    {#each products as { id, name, image, alt }}
      <li>
        <a
          sveltekit:prefetch
          href="/products/{id}"
          title="Link to {name} product page"
        >
          <img src={image} width="284" height="284" {alt} loading="lazy" />
          <h3>{name}</h3>
        </a>
      </li>
    {/each}
  </ul>
{:else}
  <span class="error">Unable to retrieve products :(</span>
{/if}

<style lang="scss">
  ul {
    li {
      border-radius: $border-radius;
      // background: #f9dda5;
      padding: 1rem;
      text-align: center;

      @include for-tablet-up {
        width: 300px;
      }
    }

    a {
      display: inline-block;
      text-decoration: none;
      transition: transform 0.15s ease-out;

      &:hover {
        transform: scale(1.05);

        h3 {
          color: lighten($secondary-color, 10%);
        }
      }

      &:active {
        h3 {
          color: darken($secondary-color, 8%);
        }
      }

      img {
        border-radius: $border-radius;
        margin-bottom: 1rem;
        --size: 150px;
        width: var(--size);
        height: var(--size);
        background: #fff;

        @include for-tablet-up {
          --size: 250px;
        }
      }
    }

    h3 {
      padding: 0;
      font-size: 2rem;
      transition: color 0.15s ease-out;

      @include for-tablet-up {
        font-size: 2.2rem;
      }

      @include for-desktop-up {
        font-size: 2.5rem;
      }
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, calc(50% - 0.5rem));
    column-gap: 1rem;
    row-gap: 3rem;
    justify-items: center;

    @include for-tablet-up {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      column-gap: 3rem;
      row-gap: 4rem;
    }

    li {
      padding: 0;
    }
  }

  .row {
    display: flex;
    flex-wrap: nowrap;
    column-gap: 1rem;
    overflow-x: scroll;

    li {
      &:first-of-type {
        margin-left: 1rem;
      }

      &:last-of-type {
        margin-right: 1rem;
      }
    }

    img {
      --size: 200px;
      height: var(--size);
      width: var(--size);

      @include for-mobile-only {
        --size: 60vw;
      }
    }

    h3 {
      font-size: 2.2rem;
    }
  }

  .error {
    display: block;
    text-align: center;
  }
</style>
