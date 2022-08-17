## Svelte

New to Svelte? Don't be afraid to try out the [tutorial](https://svelte.dev/tutorial/basics).

## Initial installation

If you haven't already, you'll want to install the dependencies with `npm i`.

## Developing

To start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Customising SMUI components (Svelte Material UI)

Add a class to the component and configure it with the ":global" selector in CSS.
[For example:](https://sveltematerialui.com/demo/common)
```
<!--
  Note: you need an element around the SMUI component
  in order to use the "*" prefix in the selector and
  limit the styles to only elements under this
  component.
-->
<div>
  <!--
    Note: to target this class, you need to use
    a :global() selector. See the styles below.
  -->
  <Button class="myClass"><Label>This button has a Class</Label></Button>
</div>
 
<script lang="ts">
  import Button, { Label } from '@smui/button';
</script>
 
<style>
  /* Accessing the class with "*" in front limits
    the scope to anything under this component's
    elements. */
  * :global(.myClass) {
    font-style: italic;
  }
</style>
```

#### Applying changes / adding new components

Use `npm run prepare` to compile the components, then refresh your page.



## Deploying

New changes are deployed by Vercel to this [website](https://dig33.vercel.app) everytime a commit is pushed to the `main` branch.
