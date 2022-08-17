<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from "@sveltejs/kit";
	import { browser } from "$app/env";
	import verifiedAge from "../store/verifiedAge";
	import Guest from "$lib/controllers/guest/Guest";

	export async function load({ url, session }: LoadInput): Promise<LoadOutput> {
		if (browser) {
			// check if user has verified their age
			let verified;
			verifiedAge.subscribe((value) => {
				verified = value;
			});

			// redirect to age verification page
			if (!verified) {
				return {
					status: 302,
					redirect: `/verify-age?ref=${url.pathname}`,
				};
			}
		}

		// check if guest user data needs to be loaded
		if (browser && !session.accessToken && session.cart.length < 1) {
			try {
				session.cart = await Guest.loadCart();
			} catch (error) {
				console.error(error);
			}
		}

		// keep track of the URL pathname to play page transitions
		return {
			props: {
				key: url.pathname,
			},
		};
	}
</script>

<script lang="ts">
	import "../scss/app.scss";
	import Header from "$lib/header/Header.svelte";
	import Footer from "$lib/Footer.svelte";
	import Notifications from "$lib/Notifications.svelte";
	import LoadingOverlay from "$lib/LoadingOverlay.svelte";
	import BackToTopBtn from "$lib/buttons/BackToTopBtn.svelte";

	import { currentPageTitle } from "../store/index";
	$currentPageTitle = "Orchard Pig";

	export let key: string;
	import PageTransition from "$lib/PageTransition.svelte";

	// display 'book now' FAB in selected pages.
	import BookFAB from "$lib/buttons/BookFAB.svelte";
	import { page } from "$app/stores";
	const selectedPages = ["/", "/about", "/restaurant", "/contact"];
</script>

<Notifications>
	<Header>
		<PageTransition refresh={key}>
			<slot />
		</PageTransition>
	</Header>

	<!-- Floating Action Buttons (FAB) -->
	{#if selectedPages.includes($page.url.pathname)}
		<div class="fab-left">
			<BookFAB label="Book Now" />
		</div>
	{/if}

	<div class="fab-right">
		<BackToTopBtn />
	</div>

	<Footer />
	<LoadingOverlay />
</Notifications>

<style lang="scss">
	$distanceFromSide: 16px;

	.fab-left,
	.fab-right {
		position: fixed;
		z-index: 2;
		bottom: $distanceFromSide;
	}

	.fab-left {
		left: $distanceFromSide;
	}

	.fab-right {
		right: $distanceFromSide;
	}
</style>
