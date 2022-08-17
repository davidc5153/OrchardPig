<script lang="ts">
  interface breadcrumbItem {
    href: string;
    text: string;
  }

  // Pass in an array of objects, each containing a href and text property
  // to generate the breadcrumb items.
  export let items: breadcrumbItem[] = [];
</script>

<ul class="breadcrumb">
  {#each items as item, i}
    <li class="breadcrumb-item">
      {#if i === items.length - 1}
        {item.text}
      {:else}
        <a href={item.href}>{item.text}</a>
      {/if}
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    padding-left: 1rem;
    padding-right: 1rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  li {
    display: inline-block;
    color: #000;

    &:not(:last-of-type) {
      margin-right: 0.8rem;
    }

    &:not(:last-of-type):after {
      content: "/";
    }
  }

  a {
    margin-right: 0.8rem;
    color: $primary-color;
    text-transform: capitalize;
    text-decoration: none;

    &:hover {
      color: lighten($primary-color, 10%);
    }
  }
</style>
