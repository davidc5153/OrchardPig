<script lang="ts">
	// Adapted from @sveltekit/template
	import { spring } from "svelte/motion";

	const MIN_VALUE = 1;

	export let count = 1;

	const displayed_count = spring();
	$: displayed_count.set(count);
	$: offset = modulo($displayed_count, 1);

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
</script>

<div class="counter">
	<button
		on:click={() => {
			if (count > MIN_VALUE) count -= 1;
		}}
		aria-label="Decrease the counter by one"
	>
		<svg aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5" />
		</svg>
	</button>

	<div class="counter-viewport">
		<div
			class="counter-digits"
			style="transform: translate(0, {100 * offset}%)"
		>
			<strong style="top: -100%" aria-hidden="true"
				>{Math.floor($displayed_count + 1)}</strong
			>
			<strong>{Math.floor($displayed_count)}</strong>
		</div>
	</div>

	<button
		on:click={() => (count += 1)}
		aria-label="Increase the counter by one"
	>
		<svg aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
		</svg>
	</button>
</div>

<style lang="scss">
	$color: #000;
	$counter-height: 50px;

	.counter {
		display: inline-flex;
		margin: 1rem 0;
		font-family: var(--font-family-primary);
	}

	.counter button {
		height: $counter-height;
		width: $counter-height;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid $color;
		border-radius: 100%;
		background-color: transparent;
		color: $color;
		font-size: $counter-height;
		cursor: pointer;
		transition: .1s ease-out;
	}

	.counter button:hover {
		$accent-color: #777;
		border-color: $accent-color;
		path {
			stroke: $accent-color;
		}
	}

	.counter button:active {
		transform: scale(0.95);
	}

	svg {
		width: 50%;
		height: 50%;
	}

	path {
		vector-effect: non-scaling-stroke;
		stroke-width: 2px;
		stroke: $color;
	}

	.counter-viewport {
		width: 5.5em;
		height: $counter-height;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.counter-viewport strong {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 400;
		color: var(--accent-color);
		font-size: 3rem;
		align-items: center;
		justify-content: center;
	}

	.counter-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}
</style>
